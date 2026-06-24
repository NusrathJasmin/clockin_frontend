import React, { useRef, useState } from 'react';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import AddButton from '../../../components/CustomComponent/Buttons/AddButton';
import LicensesTable from './Table';
import AddLicenseModal from './AddLicenseModal';

const Licenses = () => {
	const tableRef = useRef(null);
	const urlBackup = useRef('');
	const [addModalShow, setAddModalShow] = useState(false);

	return (
		<>
			{addModalShow && (
				<AddLicenseModal
					isOpen={addModalShow}
					setIsOpen={setAddModalShow}
					tableRef={tableRef}
				/>
			)}
			<PageWrapper title='Licenses'>
				<SubHeader>
					<SubHeaderLeft>
						<CardTitle tag='div' className='h5'>
							Licenses
						</CardTitle>
					</SubHeaderLeft>
					<SubHeaderRight>
						<AddButton modalShow={setAddModalShow} name='Add License' />
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
						<LicensesTable tableRef={tableRef} urlBackup={urlBackup} />
					</CardBody>
				</Card>
			</PageWrapper>
		</>
	);
};

export default Licenses;
