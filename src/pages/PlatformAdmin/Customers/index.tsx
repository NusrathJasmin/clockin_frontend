import React, { useRef, useState } from 'react';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import AddButton from '../../../components/CustomComponent/Buttons/AddButton';
import CustomersTable from './Table';
import AddCustomerModal from './AddCustomerModal';

const Customers = () => {
	const tableRef = useRef(null);
	const urlBackup = useRef('');
	const [addModalShow, setAddModalShow] = useState(false);

	return (
		<>
			{addModalShow && (
				<AddCustomerModal
					isOpen={addModalShow}
					setIsOpen={setAddModalShow}
					tableRef={tableRef}
				/>
			)}
			<PageWrapper title='Customers'>
			<SubHeader>
				<SubHeaderLeft>
					<CardTitle tag='div' className='h5'>
						Customers
					</CardTitle>
				</SubHeaderLeft>
				<SubHeaderRight>
					<AddButton modalShow={setAddModalShow} name='Add Customer' />
				</SubHeaderRight>
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
		</>
	);
};

export default Customers;
