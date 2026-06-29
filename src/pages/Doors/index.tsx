import React, { useRef, useState } from 'react';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../layout/SubHeader/SubHeader';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import AddButton from '../../components/CustomComponent/Buttons/AddButton';
import DoorsTableComponent from './DoorsTableComponent';
import DoorForm from './DoorForm';

const Index = () => {
	const tableRef = useRef();
	const urlBackup = useRef();
	const [doorModalShow, setDoorModalShow] = useState(false);
	const [editId, setEditId] = useState<any>(null);

	const openAddModal = (state: boolean) => {
		if (state) setEditId(null);
		setDoorModalShow(state);
	};

	const editModalToggle = (id: any) => {
		setEditId(id);
		setDoorModalShow(true);
	};

	return (
		<>
			{doorModalShow && (
				<DoorForm
					isOpen={doorModalShow}
					setIsOpen={setDoorModalShow}
					tableRef={tableRef}
					title={editId ? 'Edit Door' : 'Add Door'}
					id={editId}
				/>
			)}
			<PageWrapper title='Doors'>
				<SubHeader>
					<SubHeaderLeft>
						<CardTitle tag='div' className='h5'>
							Doors
						</CardTitle>
					</SubHeaderLeft>
					<SubHeaderRight>
						<AddButton modalShow={openAddModal} name='Add Door' />
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
						<p />
						<DoorsTableComponent
							tableRef={tableRef}
							urlBackup={urlBackup}
							editModalToggle={editModalToggle}
						/>
					</CardBody>
				</Card>
			</PageWrapper>
		</>
	);
};

export default Index;
