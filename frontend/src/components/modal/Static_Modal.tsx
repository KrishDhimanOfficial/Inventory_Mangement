import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDeleteData } from '../../hooks/hook'

interface Modal { endApi: string, show: boolean; handleClose: () => void }

const Static_Modal: React.FC<Modal> = ({ endApi, show, handleClose }) => {
    const { isloading, deleteData } = useDeleteData()

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    Are You Want to Delete?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary" onClick={() => deleteData(endApi)}>
                        {isloading ? 'Deleting...' : ' Understood'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default React.memo(Static_Modal);