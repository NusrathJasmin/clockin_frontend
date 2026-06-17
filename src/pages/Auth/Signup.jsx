import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';
import classNames from 'classnames';
import { useFormik } from 'formik';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Button from '../../components/bootstrap/Button';
import useDarkMode from '../../hooks/useDarkMode';
import { publicAxios } from '../../axiosInstance';
import validateEmail from '../../helpers/emailValidator';
import { GenderOptions } from '../../helpers/constants';
import showNotification from '../../components/extras/showNotification';
import Error from '../../helpers/Error';

const mapTimezoneOptions = (raw) => {
	const list = Array.isArray(raw) ? raw : raw?.results || [];
	return list
		.map((item) => {
			const value =
				item?.timezone ??
				item?.tz ??
				item?.name ??
				item?.value ??
				(typeof item === 'string' ? item : '');
			if (!value) return null;
			const label = item?.label ?? item?.display_name ?? String(value);
			return { label: String(label), value: String(value) };
		})
		.filter(Boolean);
};

const Signup = ({ onSwitchToLogin }) => {
	const { darkModeStatus } = useDarkMode();
	const [waitingForAxios, setWaitingForAxios] = useState(false);
	const [timezoneOptions, setTimezoneOptions] = useState([]);
	const [timezonesLoading, setTimezonesLoading] = useState(true);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			name: '',
			email: '',
			first_name: '',
			last_name: '',
			gender: 'Other',
			country: '',
			timezone: '',
		},
		validate: (values) => {
			const errors = {};
			const requiredFields = [
				'name',
				'email',
				'first_name',
				'last_name',
				'gender',
				'country',
				'timezone',
			];

			requiredFields.forEach((field) => {
				if (!String(values[field] || '').trim()) {
					errors[field] = 'Required';
				}
			});

			const emailError = validateEmail(values.email);
			if (emailError) {
				errors.email = emailError;
			}

			return errors;
		},
		onSubmit: (values) => {
			handleSignup(values);
		},
	});

	useEffect(() => {
		publicAxios
			.get('api/customers/timezones/')
			.then((res) => {
				const options = mapTimezoneOptions(res?.data);
				setTimezoneOptions(options);
				if (options.length > 0) {
					formik.setFieldValue('timezone', options[0].value);
				}
			})
			.catch((error) => {
				const errorMsg = Error(error, () => {});
				showNotification('Error', errorMsg, 'danger');
				setTimezoneOptions([]);
			})
			.finally(() => {
				setTimezonesLoading(false);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSignup = (values) => {
		setWaitingForAxios(true);

		const payload = {
			name: values.name.trim(),
			email: values.email.trim(),
			first_name: values.first_name.trim(),
			last_name: values.last_name.trim(),
			gender: values.gender,
			country: values.country.trim(),
			timezone: values.timezone,
		};

		publicAxios
			.post('api/customers/signup/', payload)
			.then((response) => {
				setWaitingForAxios(false);
				const message =
					response?.data?.message ||
					response?.data?.detail ||
					'Account created successfully. Please sign in.';
				showNotification('Success', message, 'success');
				onSwitchToLogin();
			})
			.catch((error) => {
				setWaitingForAxios(false);
				const errorMsg = Error(error, () => {});
				showNotification('Error', errorMsg, 'danger');

				if (error?.response?.status === 400 && error?.response?.data) {
					const data = error.response.data;
					Object.keys(data).forEach((key) => {
						if (Object.prototype.hasOwnProperty.call(formik.values, key)) {
							const fieldError = Array.isArray(data[key]) ? data[key].join(', ') : String(data[key]);
							formik.setFieldError(key, fieldError);
						}
					});
				}
			});
	};

	const selectClassName = classNames('form-select', {
		'bg-l10-dark': !darkModeStatus,
		'bg-dark text-light': darkModeStatus,
	});

	return (
		<>
			<form
				className='row g-3'
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						formik.handleSubmit();
					}
				}}>
				<div className='col-12'>
					<FormGroup id='name' isFloating label='Company Name'>
						<Input
							autoComplete='organization'
							value={formik.values.name}
							isTouched={formik.touched.name}
							invalidFeedback={formik.errors.name}
							isValid={formik.isValid}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-12'>
					<FormGroup id='email' isFloating label='Email'>
						<Input
							type='email'
							autoComplete='email'
							value={formik.values.email}
							isTouched={formik.touched.email}
							invalidFeedback={formik.errors.email}
							isValid={formik.isValid}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-12'>
					<FormGroup id='first_name' isFloating label='First Name'>
						<Input
							autoComplete='given-name'
							value={formik.values.first_name}
							isTouched={formik.touched.first_name}
							invalidFeedback={formik.errors.first_name}
							isValid={formik.isValid}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-12'>
					<FormGroup id='last_name' isFloating label='Last Name'>
						<Input
							autoComplete='family-name'
							value={formik.values.last_name}
							isTouched={formik.touched.last_name}
							invalidFeedback={formik.errors.last_name}
							isValid={formik.isValid}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-12'>
					<FormGroup id='gender' label='Gender'>
						<select
							id='gender'
							name='gender'
							className={selectClassName}
							value={formik.values.gender}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}>
							{GenderOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
						{formik.touched.gender && formik.errors.gender && (
							<div className='invalid-feedback d-block'>{formik.errors.gender}</div>
						)}
					</FormGroup>
				</div>
				<div className='col-12'>
					<FormGroup id='country' isFloating label='Country'>
						<Input
							autoComplete='country-name'
							value={formik.values.country}
							isTouched={formik.touched.country}
							invalidFeedback={formik.errors.country}
							isValid={formik.isValid}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-12 mb-4'>
					<FormGroup id='timezone' label='Timezone'>
						<select
							id='timezone'
							name='timezone'
							className={selectClassName}
							value={formik.values.timezone}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							disabled={timezonesLoading || timezoneOptions.length === 0}>
							{timezonesLoading ? (
								<option value=''>Loading timezones...</option>
							) : timezoneOptions.length === 0 ? (
								<option value=''>No timezones available</option>
							) : (
								timezoneOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))
							)}
						</select>
						{formik.touched.timezone && formik.errors.timezone && (
							<div className='invalid-feedback d-block'>{formik.errors.timezone}</div>
						)}
					</FormGroup>
				</div>

				<div className='col-12 mt-2 text-center'>
					<Button
						color='warning'
						icon='PersonAdd'
						className='py-2'
						style={{ width: '150px' }}
						isDisable={waitingForAxios || timezonesLoading || timezoneOptions.length === 0}
						onClick={formik.handleSubmit}>
						{waitingForAxios ? <Spinner size='sm' /> : 'Sign Up'}
					</Button>
				</div>
			</form>

			<div className='text-center mt-4'>
				<p className='mb-0'>
					Already have an account?{' '}
					<button
						type='button'
						className='btn btn-link p-0 align-baseline'
						onClick={onSwitchToLogin}>
						Login
					</button>
				</p>
			</div>
		</>
	);
};

Signup.propTypes = {
	onSwitchToLogin: PropTypes.func.isRequired,
};

export default Signup;
