import React from 'react';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import ReactSelectComponent from '../../components/CustomComponent/Select/ReactSelectComponent';

const groupTypeOptions = [
	{ label: 'Department', value: 'Department' },
	{ label: 'Project Group', value: 'Project Group' },
	{ label: 'Other Group', value: 'Other Group' },
];

const GroupFields = ({
	register,
	errors,
	control,
	getValues,
	parentGroupOptions,
	leadOptions,
	scheduleOptions,
	sitesOptions,
	leaveTypeOptions,
}: any) => {
	return (
		<>
			<div className='col-12'>
				<FormGroup label='Group Name *'>
					<input
						type='text'
						className='form-control'
						{...register('name', { required: true })}
					/>
					{errors?.name?.type === 'required' ? (
						<span style={{ color: 'red' }}>*This field is required</span>
					) : (
						<p />
					)}
				</FormGroup>
			</div>

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Group Type *'
					isMulti={false}
					field_name='group_type'
					getValues={getValues}
					errors={errors}
					options={groupTypeOptions}
					isRequired
				/>
			</div>

			<div className='col-12'>
				<FormGroup label='Priority *'>
					<input
						type='number'
						className='form-control'
						min='0'
						{...register('priority_choice_number', { required: true, valueAsNumber: true })}
					/>
					{errors?.priority_choice_number?.type === 'required' ? (
						<span style={{ color: 'red' }}>*This field is required</span>
					) : (
						<p />
					)}
				</FormGroup>
			</div>

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Parent Group'
					isMulti={false}
					field_name='parent_group'
					getValues={getValues}
					errors={errors}
					options={parentGroupOptions}
					isRequired={false}
					isClearable
				/>
			</div>

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Primary Contact'
					isMulti={false}
					field_name='lead_one'
					getValues={getValues}
					errors={errors}
					options={leadOptions}
					isRequired={false}
					isClearable
				/>
			</div>

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Secondary Contact'
					isMulti={false}
					field_name='lead_two'
					getValues={getValues}
					errors={errors}
					options={leadOptions}
					isRequired={false}
					isClearable
				/>
			</div>
			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Schedule'
					isMulti
					field_name='schedule'
					getValues={getValues}
					errors={errors}
					options={scheduleOptions}
					isRequired={false}
					isClearable
				/>
			</div>
			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Sites'
					isMulti
					field_name='sites'
					getValues={getValues}
					errors={errors}
					options={sitesOptions}
					isRequired={false}
					isClearable
				/>
			</div>
			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Leave types'
					isMulti
					field_name='leave_types'
					getValues={getValues}
					errors={errors}
					options={leaveTypeOptions}
					isRequired={false}
					isClearable
				/>
			</div>
		</>
	);
};

export default GroupFields;
