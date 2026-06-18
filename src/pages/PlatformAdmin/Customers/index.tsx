import React, { useRef } from 'react';
import SubHeader, { SubHeaderLeft } from '../../../layout/SubHeader/SubHeader';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import CustomersTable from './Table';

const Customers = () => {
	const tableRef = useRef(null);
	const urlBackup = useRef('');

	return (
		<PageWrapper title='Customers'>
			<SubHeader>
				<SubHeaderLeft>
					<CardTitle tag='div' className='h5'>
						Customers
					</CardTitle>
				</SubHeaderLeft>
			</SubHeader>
			<Card stretch>
				<CardHeader borderSize={1}>
					<CardLabel icon='' iconColor='info'>
						<CardTitle tag='div' className='h5'>
							<p />
						</CardTitle>
					</CardLabel>
				</CardHeader>
				<CardBody className='table-responsive'>
					<CustomersTable tableRef={tableRef} urlBackup={urlBackup} />
				</CardBody>
			</Card>
		</PageWrapper>
	);
};

export default Customers;
