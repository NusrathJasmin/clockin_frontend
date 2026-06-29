import React from 'react';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import ReactSelectComponent from '../../components/CustomComponent/Select/ReactSelectComponent';
import {
	DEVICE_TYPE_OPTIONS,
	DIRECTION_OPTIONS,
	DOOR_STATUS_OPTIONS,
} from './doorConstants';

const DoorFields = ({
	register,
	errors,
	control,
	getValues,
	siteOptions,
}: any) => {
	return (
		<>
			<div className='col-12'>
				<FormGroup label='Name *'>
					<input type='text' className='form-control' {...register('name', { required: true })} />
					{errors?.name?.type === 'required' ? (
						<span style={{ color: 'red' }}>*This field is required</span>
					) : (
						<p />
					)}
				</FormGroup>
			</div>

			<div className='col-12'>
				<FormGroup label='Entry Reader ID'>
					<input
						type='text'
						className='form-control'
						{...register('entry_reader_id')}
					/>
				</FormGroup>
			</div>

			<div className='col-12'>
				<FormGroup label='Exit Reader ID'>
					<input
						type='text'
						className='form-control'
						{...register('exit_reader_id')}
					/>
				</FormGroup>
			</div>

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Device Type *'
					isMulti={false}
					field_name='device_type'
					getValues={getValues}
					errors={errors}
					options={DEVICE_TYPE_OPTIONS}
					isRequired
				/>
			</div>

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Direction *'
					isMulti={false}
					field_name='direction'
					getValues={getValues}
					errors={errors}
					options={DIRECTION_OPTIONS}
					isRequired
				/>
			</div>

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Site *'
					isMulti={false}
					field_name='site'
					getValues={getValues}
					errors={errors}
					options={siteOptions}
					isRequired
				/>
			</div>

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Status *'
					isMulti={false}
					field_name='status'
					getValues={getValues}
					errors={errors}
					options={DOOR_STATUS_OPTIONS}
					isRequired
				/>
			</div>
		</>
	);
};

export default DoorFields;
