import React, { useCallback, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { Form } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { authAxios } from '../../axiosInstance';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import ListGroup, { ListGroupItem } from '../../components/bootstrap/ListGroup';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../components/bootstrap/Modal';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import AddButton from '../../components/CustomComponent/Buttons/AddButton';
import SaveButton from '../../components/CustomComponent/Buttons/SaveButton';
import ReactSelectComponent from '../../components/CustomComponent/Select/ReactSelectComponent';
import useToasterNotification from '../../hooks/useToasterNotification';
import { buttonColor } from '../../helpers/constants';
import { Tooltip } from '@mui/material';
import swalFire from '../../helpers/swalHelper';

const MEMBERS_CARD_HEIGHT_PX = 420;

export type GroupMemberUser = {
	id: number;
	email?: string;
	first_name?: string;
	middle_name?: string | null;
	last_name?: string;
	preferred_name?: string;
};

type SelectOption = { label: string; value: number };

const formatUserName = (user: GroupMemberUser): string => {
	const preferred = user?.preferred_name?.trim();
	if (preferred) return preferred;
	const parts = [user?.first_name, user?.middle_name, user?.last_name].filter(Boolean);
	const full = parts.join(' ').trim();
	return full || user?.email || `User ${user.id}`;
};

const normalizeMembersResponse = (data: unknown): GroupMemberUser[] => {
	if (!data || typeof data !== 'object') return [];
	const users = (data as { users?: unknown }).users;
	return Array.isArray(users) ? (users as GroupMemberUser[]) : [];
};

const accountToOption = (item: any): SelectOption => ({
	label:
		`${item?.preferred_name || ''}`.trim() ||
		`${item?.first_name || ''} ${item?.last_name || ''}`.trim() ||
		item?.email ||
		`User ${item?.id}`,
	value: Number(item?.id),
});

type MemberRowProps = {
	user: GroupMemberUser;
	onRemove: (user: GroupMemberUser) => void;
	removing: boolean;
};

const MemberRow = ({ user, onRemove, removing }: MemberRowProps) => (
	<ListGroupItem className='border-0 border-bottom px-0 py-3'>
		<div className='d-flex align-items-center justify-content-between gap-2'>
			<div className='min-w-0'>
				<div className='fw-semibold text-truncate'>{formatUserName(user)}</div>
				{user.email && <div className='small text-muted text-truncate'>{user.email}</div>}
			</div>
			<Tooltip arrow title='Remove from group' placement='top'>
				<Button
					isOutline={false}
					color='danger'
					isLight
					size='sm'
					icon='Delete'
					isDisable={removing}
					onClick={() => onRemove(user)}
				/>
			</Tooltip>
		</div>
	</ListGroupItem>
);

type AddMembersModalProps = {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	groupId: string | number;
	onAdded: () => void;
};

const AddMembersModal = ({ isOpen, setIsOpen, groupId, onAdded }: AddMembersModalProps) => {
	const [options, setOptions] = useState<SelectOption[]>([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const { showErrorNotification, showSuccessNotification } = useToasterNotification();

	const {
		control,
		handleSubmit,
		reset,
		getValues,
		formState: { errors },
	} = useForm<{ users: SelectOption[] }>({
		defaultValues: { users: [] },
	});

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		authAxios
			.get('api/hr/accounts/', { params: { paginate: 'off' } })
			.then((res) => {
				if (cancelled) return;
				const list = Array.isArray(res.data) ? res.data : res.data?.results || [];
				setOptions(list.map(accountToOption));
			})
			.catch((err) => {
				if (!cancelled) showErrorNotification(err);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const onSubmit = (data: { users: SelectOption[] }) => {
		const userIds = (data?.users || [])
			.map((s) => s.value)
			.filter((id) => !Number.isNaN(id));
		if (!userIds.length) {
			showErrorNotification('Select at least one user');
			return;
		}
		setSaving(true);
		authAxios
			.post('api/hr/group-members/', {
				group: Number(groupId),
				user_ids: userIds,
			})
			.then(() => {
				showSuccessNotification('Members added');
				reset({ users: [] });
				setIsOpen(false);
				onAdded();
			})
			.catch(showErrorNotification)
			.finally(() => setSaving(false));
	};

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='md' isCentered>
			<ModalHeader className='p-4' setIsOpen={setIsOpen}>
				<ModalTitle id='add-members-modal'>Add members</ModalTitle>
			</ModalHeader>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody className='px-4 pb-2'>
					{loading ? (
						<div className='d-flex justify-content-center py-4'>
							<CustomSpinner />
						</div>
					) : (
						<>
							<ReactSelectComponent
								control={control}
								name='Users *'
								isMulti
								field_name='users'
								getValues={getValues}
								errors={errors}
								options={options}
								isRequired
							/>
						</>
					)}
				</ModalBody>
				<ModalFooter className='px-4 pb-4'>
					<Button color='dark' isLight type='button' onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<div className='flex-grow-1' style={{ maxWidth: '12rem' }}>
						<SaveButton state={saving || loading} />
					</div>
				</ModalFooter>
			</Form>
		</Modal>
	);
};

type Props = {
	groupId?: string | number;
};

const GroupMembersSection = ({ groupId }: Props) => {
	const [members, setMembers] = useState<GroupMemberUser[]>([]);
	const [loading, setLoading] = useState(false);
	const [removingId, setRemovingId] = useState<number | null>(null);
	const [addOpen, setAddOpen] = useState(false);
	const { showErrorNotification, showSuccessNotification } = useToasterNotification();
	const fetchIdRef = useRef(0);

	const fetchMembers = useCallback(() => {
		if (groupId == null || groupId === '') {
			setMembers([]);
			return;
		}
		const fetchId = ++fetchIdRef.current;
		setLoading(true);
		authAxios
			.get('api/hr/group-members/', { params: { group: groupId } })
			.then((res) => {
				if (fetchId !== fetchIdRef.current) return;
				setMembers(normalizeMembersResponse(res.data));
			})
			.catch((err) => {
				if (fetchId !== fetchIdRef.current) return;
				setMembers([]);
				showErrorNotification(err);
			})
			.finally(() => {
				if (fetchId === fetchIdRef.current) setLoading(false);
			});
	}, []);

	useEffect(() => {
		fetchMembers();
	}, [fetchMembers]);

	const removeMembers = (userIds: number[], userLabel: string) => {
		if (!groupId || !userIds.length) return;
		swalFire({ 
			title: 'Remove member(s)?',
			text: `Remove ${userLabel} from this group?`,
			icon: 'warning',
			showCancelButton: true,
			iconColor: buttonColor[0],
			confirmButtonColor: buttonColor[0],
			cancelButtonColor: buttonColor[1],
			confirmButtonText: 'Remove',
		}).then((result) => {
			if (!result.isConfirmed) return;
			setRemovingId(userIds.length === 1 ? userIds[0] : -1);
			authAxios
				.delete('api/hr/group-members/remove-members/', {
					data: { group: Number(groupId), user_ids: userIds },
				})
				.then(() => {
					showSuccessNotification('Member(s) removed');
					fetchMembers();
				})
				.catch(showErrorNotification)
				.finally(() => setRemovingId(null));
		});
	};

	const handleRemoveOne = (user: GroupMemberUser) => {
		removeMembers([user.id], `"${formatUserName(user)}"`);
	};

	if (groupId == null || groupId === '') return null;

	return (
		<div className='w-100 h-100'>
			<Card
				className='w-100 h-100 d-flex flex-column overflow-hidden'
				style={{ height: MEMBERS_CARD_HEIGHT_PX, maxHeight: MEMBERS_CARD_HEIGHT_PX }}>
				<CardHeader className='flex-shrink-0'>
					<CardLabel icon='People' iconColor='warning'>
						<CardTitle tag='div' className='h5 text-warning'>
							Group members
						</CardTitle>
					</CardLabel>
					<CardActions>
						<AddButton modalShow={setAddOpen} name='Add members' />
					</CardActions>
				</CardHeader>
				<CardBody
					className='d-flex flex-column flex-grow-1 overflow-hidden pt-0'
					style={{ minHeight: 0 }}>
					{loading ? (
						<div className='d-flex justify-content-center align-items-center flex-grow-1 py-4'>
							<CustomSpinner />
						</div>
					) : members.length === 0 ? (
						<div className='d-flex flex-grow-1 w-100 align-items-center justify-content-center'>
							<p className='text-muted mb-0'>No members in this group yet.</p>
						</div>
					) : (
						<div className='flex-grow-1 overflow-auto'>
							<ListGroup isFlush>
								{members.map((user) => (
									<MemberRow
										key={user.id}
										user={user}
										onRemove={handleRemoveOne}
										removing={removingId === user.id || removingId === -1}
									/>
								))}
							</ListGroup>
						</div>
					)}
				</CardBody>
			</Card>
			{addOpen && (
				<AddMembersModal
					isOpen={addOpen}
					setIsOpen={setAddOpen}
					groupId={groupId}
					onAdded={fetchMembers}
				/>
			)}
		</div>
	);
};

export default GroupMembersSection;
