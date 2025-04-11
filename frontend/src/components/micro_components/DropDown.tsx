import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { Link } from 'react-router';

const DropDownMenu = ({ editURL, detailsURL, deletedata }: {
    editURL: string,
    detailsURL: string,
    deletedata: () => void
}) => {
    return (
        <>
            <DropdownButton
                key='start'
                id={`dropdown-button-drop-start`}
                drop='start'
                variant="white"
                title={<i className="fa-solid fa-ellipsis-vertical"></i>}
                className='me-2'
            >
                <Dropdown.Item eventKey="1">
                    <Link to={editURL} className='text-dark text-decoration-none'> Edit </Link>
                </Dropdown.Item>
                <Dropdown.Item eventKey="2">Create Payment</Dropdown.Item>
                <Dropdown.Item eventKey="3">
                    <Link to={detailsURL} className='text-dark text-decoration-none'> Sales Details </Link></Dropdown.Item>
                <Dropdown.Item eventKey="4">
                    <span onClick={() => deletedata()}> Delete </span>
                </Dropdown.Item>
            </DropdownButton>
        </>
    )
}
export default DropDownMenu