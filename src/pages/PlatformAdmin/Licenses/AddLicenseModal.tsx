import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
import { useForm } from 'react-hook-form';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import Button from '../../../components/bootstrap/Button';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import SaveButton from '../../../components/CustomComponent/Buttons/SaveButton';
import ReactSelectComponent from '../../../components/CustomComponent/Select/ReactSelectComponent';
import CustomSpinner from '../../../components/CustomSpinner/CustomSpinner';
import { authAxios } from '../../../axiosInstance';
import useToasterNotification from '../../../hooks/useToasterNotification';

type SelectOption = { label: string; value: number };

type AddLicenseForm = {
	client: SelectOption | null;
	max_users: string;
	start_date: string;
	expiry_date: string;
	plan_name: string;
	is_trial: boolean;
};

type AddLicenseModalProps = {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	tableRef: React.RefObject<{ onQueryChange?: () => void } | null>;
};

const mapClientOptions = (raw: unknown): SelectOption[] => {
	const list = Array.isArray(raw) ? raw : (raw as { results?: unknown[] })?.results || [];
	return list
		.map((item: unknown) => {
			const record = item as Record<string, unknown>;
			const id = record?.id;
			if (id == null) return null;
			const label =
				record?.name ??
				record?.schema_name ??
				record?.primary_domain ??
				`Client ${id}`;
			return { label: String(label), value: Number(id) };
		})
		.filter(Boolean) as SelectOption[];
};

const AddLicenseModal = ({ isOpen, setIsOpen, tableRef }: AddLicenseModalProps) => {
	const {
		register,
		handleSubmit,
		reset,
		control,
		getValues,
		formState: { errors },
	} = useForm<AddLicenseForm>({
		defaultValues: {
			client: null,
			max_users: '',
			start_date: '',
			expiry_date: '',
			plan_name: '',
			is_trial: false,
		},
	});

	const [saving, setSaving] = useState(false);
	const [loading, setLoading] = useState(false);
	const [clientOptions, setClientOptions] = useState<SelectOption[]>([]);
	const { showErrorNotification, showSuccessNotification } = useToasterNotification();

	useEffect(() => {
		if (!isOpen) return;

		reset({
			client: null,
			max_users: '',
			start_date: '',
			expiry_date: '',
			plan_name: '',
			is_trial: false,
		});

		let cancelled = false;
		setLoading(true);
		authAxios
			.get('api/customers/clients/')
			.then((res) => {
				if (!cancelled) {
					setClientOptions(mapClientOptions(res?.data?.results ?? res?.data));
				}
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
		// eslint-disable-next-line react-hooks/exhaustive-deps -- only refetch when modal opens
	}, [isOpen, reset]);

	const onSubmit = (data: AddLicenseForm) => {
		const payload = {
			client: Number(data.client?.value),
			max_users: Number(data.max_users),
			start_date: data.start_date,
			expiry_date: data.expiry_date,
			plan_name: data.plan_name?.trim() || '',
			is_trial: Boolean(data.is_trial),
		};

		setSaving(true);
		authAxios
			.post('api/customers/licenses/', payload)
			.then((response) => {
				const message =
					response?.data?.message ||
					response?.data?.detail ||
					'License added successfully.';
				showSuccessNotification(message);
				tableRef?.current?.onQueryChange?.();
				setIsOpen(false);
			})
			.catch(showErrorNotification)
			.finally(() => setSaving(false));
	};

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='lg' isCentered isScrollable isAnimation={false}>
			<ModalHeader className='p-4' setIsOpen={setIsOpen}>
				<ModalTitle id='add-license-modal'>Add License</ModalTitle>
			</ModalHeader>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody className='px-4 pb-2'>
					{loading ? (
						<div className='d-flex justify-content-center py-4'>
							<CustomSpinner />
						</div>
					) : (
						<div className='row g-4'>
							<div className='col-md-6'>
								<ReactSelectComponent
									control={control}
									name='Client *'
									isMulti={false}
									field_name='client'
									getValues={getValues}
									errors={errors}
									options={clientOptions}
									isRequired
								/>
							</div>
							<FormGroup label='Plan Name *' className='col-md-6'>
								<input
									type='text'
									className='form-control'
									style={{ height: '40px' }}
									{...register('plan_name', { required: true })}
								/>
								{errors.plan_name?.type === 'required' && (
									<span className='text-danger small'>*This field is required</span>
								)}
							</FormGroup>
							<FormGroup label='Max Users *' className='col-md-6'>
								<input
									type='number'
									min={1}
									className='form-control'
									style={{ height: '40px' }}
									{...register('max_users', {
										required: true,
										min: { value: 1, message: 'Must be at least 1' },
									})}
								/>
								{errors.max_users?.type === 'required' && (
									<span className='text-danger small'>*This field is required</span>
								)}
								{errors.max_users?.type === 'min' && (
									<span className='text-danger small'>{errors.max_users.message}</span>
								)}
							</FormGroup>
							<FormGroup
								label='Trial License'
								className='col-md-6 d-flex align-items-end'
							>
								<div className='form-check mb-2 ms-3'>
									<input
										type='checkbox'
										className='form-check-input'
										id='is_trial'
										{...register('is_trial')}
									/>
								</div>
							</FormGroup>
							<FormGroup label='Start Date *' className='col-md-6'>
								<input
									type='date'
									className='form-control'
									style={{ height: '40px' }}
									{...register('start_date', { required: true })}
								/>
								{errors.start_date?.type === 'required' && (
									<span className='text-danger small'>*This field is required</span>
								)}
							</FormGroup>
							<FormGroup label='Expiry Date *' className='col-md-6'>
								<input
									type='date'
									className='form-control'
									style={{ height: '40px' }}
									{...register('expiry_date', { required: true })}
								/>
								{errors.expiry_date?.type === 'required' && (
									<span className='text-danger small'>*This field is required</span>
								)}
							</FormGroup>
						</div>
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

/* eslint-disable react/forbid-prop-types */
AddLicenseModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	tableRef: PropTypes.object.isRequired,
};
/* eslint-enable react/forbid-prop-types */

export default AddLicenseModal;
