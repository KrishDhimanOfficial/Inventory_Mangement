import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDeleteData } from '../../hooks/hook'

interface Modal {
    endApi: string,
    show: boolean;
    handleClose?: () => void,
    refreshTable: () => void
}

const Static_Modal: React.FC<Modal> = ({ endApi, show, handleClose, refreshTable }) => {
    const { isloading, apiResponse: res, deleteData } = useDeleteData()

    useEffect(() => {
        if (res?.success) refreshTable()
    }, [res])
    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Remove Info</Modal.Title>
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

export default React.memo(Static_Modal)