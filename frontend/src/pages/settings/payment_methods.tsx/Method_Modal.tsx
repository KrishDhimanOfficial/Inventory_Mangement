import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Button, Input } from '../../../components/component';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller, } from 'react-hook-form'
import { Notify, DataService } from '../../../hooks/hook'
import { useSelector } from 'react-redux';

interface Data {
    _id: string,
    name: string,
}

interface Modal { show: boolean; handleClose: () => void, refreshTable: () => void }
const defaultValues = { name: '' }
const validationSchema = yup.object().shape({
    name: yup.string().required().matches(/^[A-Za-z0-9\s]{1,10}$/, 'Name must be 1-10 characters long.'),
})

const Method_Modal: React.FC<Modal> = ({ show, handleClose, refreshTable }) => {
    const { data }: { data: Data } = useSelector((state: any) => state.singleData)

    const { control, reset, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues, resolver: yupResolver(validationSchema)
    })

    const submitData = async (formdata: object) => {
        try {
            const res = data._id
                ? await DataService.put(`/payment-method/${data._id}`, formdata)
                : await DataService.post('/payment-method', formdata)
            if (!data._id) reset()
            Notify(res) // Show API Response
            if (res.success) refreshTable(), handleClose()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (data) setValue('name', data.name)
    }, [data?._id])

    return (
        <Modal
            show={show}
            // size='md'
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <h1>{data?._id ? 'Edit Payment Method' : 'Add Payment Method'}</h1>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(submitData)} autoComplete='off' className="form p-0">
                    <div className="row">
                        <div className="col-12">
                            <div className="flex-column">
                                <label>Name </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.name?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            className="input"
                                            placeholder="Enter Payment Method"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    {
                        data._id
                            ? (<Button
                                type='submit'
                                className='button-submit'
                                text={isSubmitting ? 'updating...' : 'Update'}
                            />)
                            : (<Button
                                type='submit'
                                className='button-submit'
                                text={isSubmitting ? 'Creating...' : 'Create'}
                            />)

                    }
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default Method_Modal