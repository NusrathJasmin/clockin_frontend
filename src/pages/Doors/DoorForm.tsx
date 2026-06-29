import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
import { useForm } from 'react-hook-form';
import OffCanvasComponent from '../../components/OffCanvasComponent';
import Card, { CardBody } from '../../components/bootstrap/Card';
import SaveButton from '../../components/CustomComponent/Buttons/SaveButton';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import { authAxios } from '../../axiosInstance';
import useToasterNotification from '../../hooks/useToasterNotification';
import DoorFields from './DoorFields';
import {
	DEVICE_TYPE_OPTIONS,
	DIRECTION_OPTIONS,
	DOOR_STATUS_OPTIONS,
	findOption,
} from './doorConstants';

const defaultSelectValues = {
	device_type: DEVICE_TYPE_OPTIONS.find((opt) => opt.value === 'FINGERPRINT') || null,
	direction: DIRECTION_OPTIONS.find((opt) => opt.value === 'BOTH') || null,
	status: DOOR_STATUS_OPTIONS.find((opt) => opt.value === 'ONLINE') || null,
	site: null,
};

const DoorForm = ({ isOpen, setIsOpen, tableRef, title, id }: any) => {
	const {
		register,
		handleSubmit,
		reset,
		control,
		getValues,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			entry_reader_id: '',
			exit_reader_id: '',
			...defaultSelectValues,
		},
	});

	const [waitingForAxios, setWaitingForAxios] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [siteOptions, setSiteOptions] = useState([]);
	const { showErrorNotification } = useToasterNotification();
	const isEdit = Boolean(id);

	useEffect(() => {
		if (!isOpen) return;

		setIsLoading(true);

		const sitesReq = authAxios.get('api/hr/sites/?paginate=off');
		const doorReq = isEdit ? authAxios.get(`api/hr/doors/${id}/`) : Promise.resolve(null);

		Promise.all([sitesReq, doorReq])
			.then(([sitesRes, doorRes]: any) => {
				const siteOpts =
					sitesRes?.data?.map((item: any) => ({
						label: item?.name,
						value: item?.id,
						...item,
					})) || [];
				setSiteOptions(siteOpts);

				if (!isEdit) {
					reset({
						name: '',
						entry_reader_id: '',
						exit_reader_id: '',
						...defaultSelectValues,
					});
					setIsLoading(false);
					return;
				}

				const door = doorRes?.data || {};
				const rawSiteId =
					door?.site_id ??
					(typeof door?.site === 'object' && door?.site != null ? door.site?.id : door?.site);
				let selectedSite =
					siteOpts.find((opt: any) => String(opt.value) === String(rawSiteId)) || null;
				if (!selectedSite && door?.site != null && typeof door.site === 'object') {
					const sid = door.site?.id;
					if (sid != null) {
						selectedSite = {
							label: door.site?.name || `Site ${sid}`,
							value: sid,
							...door.site,
						};
					}
				}

				reset({
					name: door?.name || '',
					entry_reader_id: door?.entry_reader_id || '',
					exit_reader_id: door?.exit_reader_id || '',
					device_type: findOption(DEVICE_TYPE_OPTIONS, door?.device_type),
					direction: findOption(DIRECTION_OPTIONS, door?.direction),
					status: findOption(DOOR_STATUS_OPTIONS, door?.status),
					site: selectedSite,
				});
				setIsLoading(false);
			})
			.catch((err) => {
				setIsLoading(false);
				showErrorNotification(err);
			});
	}, [id, isEdit, isOpen]);

	const onSubmit = (data: any) => {
		setWaitingForAxios(true);
		const payload = {
			name: data?.name?.trim() || '',
			entry_reader_id: data?.entry_reader_id?.trim() || null,
			exit_reader_id: data?.exit_reader_id?.trim() || null,
			device_type: data?.device_type?.value || '',
			direction: data?.direction?.value || '',
			site: data?.site?.value != null ? Number(data.site.value) : null,
			status: data?.status?.value || '',
		};

		const req = isEdit
			? authAxios.patch(`api/hr/doors/${id}/`, payload)
			: authAxios.post('api/hr/doors/', payload);

		req
			.then(() => {
				setWaitingForAxios(false);
				tableRef?.current?.onQueryChange();
				setIsOpen(false);
			})
			.catch((err) => {
				setWaitingForAxios(false);
				showErrorNotification(err);
			});
	};

	return (
		<OffCanvasComponent isOpen={isOpen} placement='end' title={title} setOpen={setIsOpen}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Card>
					<CardBody>
						{isLoading ? (
							<CustomSpinner />
						) : (
							<>
								<DoorFields
									register={register}
									errors={errors}
									control={control}
									getValues={getValues}
									siteOptions={siteOptions}
								/>
								<div className='row m-0'>
									<div className='col-12 p-3'>
										<SaveButton state={waitingForAxios} />
									</div>
								</div>
							</>
						)}
					</CardBody>
				</Card>
			</Form>
		</OffCanvasComponent>
	);
};

DoorForm.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	tableRef: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	id: PropTypes.any,
};

DoorForm.defaultProps = {
	id: null,
};

export default DoorForm;
