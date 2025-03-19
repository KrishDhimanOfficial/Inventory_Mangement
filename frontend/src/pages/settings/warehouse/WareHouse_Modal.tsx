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
    address: string,
    zipcode: string,
    country: string,
    city: string,
    state: string
}

interface Modal { show: boolean; handleClose: () => void, refreshTable: () => void }
const defaultValues = { name: '', address: '', zipcode: '', country: '', city: '', state: '' }
const validationSchema = yup.object().shape({
    name: yup.string().required().matches(/^[A-Za-z0-9\s]{1,30}$/, 'Name must be 1-30 characters long.'),
    address: yup.string().required(),
    zipcode: yup.string().required(),
    country: yup.string().required().matches(/^[A-Za-z\s]{1,30}$/, 'Invalid Country Name.'),
    city: yup.string().required().matches(/^[A-Za-z\s]{1,30}$/, 'Invalid City Name.'),
    state: yup.string().required().matches(/^[A-Za-z\s]{1,30}$/, 'Invalid State Name.'),
})

const Warehouse_Modal: React.FC<Modal> = ({ show, handleClose, refreshTable }) => {
    const { data }: { data: Data } = useSelector((state: any) => state.singleData)

    const { control, reset, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues, resolver: yupResolver(validationSchema)
    })

    const submitData = async (formdata: object) => {
        try {
            const res = data._id
                ? await DataService.put(`/warehouse/${data._id}`, formdata)
                : await DataService.post('/warehouse', formdata)
            if (!data._id) reset()
            Notify(res) // Show API Response
            refreshTable()
        } catch (error) {
            console.error(error)
        }
    }


    useEffect(() => {
        if (data) {
            setValue('name', data.name)
            setValue('address', data.address)
            setValue('city', data.city)
            setValue('country', data.country)
            setValue('zipcode', data.zipcode)
            setValue('state', data.state)
        }
    }, [data?._id])

    return (
        <Modal
            show={show}
            size='lg'
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <h1>{data?._id ? 'Edit Warehouse Details' : 'Add Warehouse'}</h1>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(submitData)} autoComplete='off' className="form p-0">
                    <div className="row">
                        <div className="col-md-6">
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
                                            placeholder="Enter Warehouse Name"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="flex-column">
                                <label>State  </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.state?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="state"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            className="input"
                                            placeholder="Enter State"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="flex-column">
                                <label>City  </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.city?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="city"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            className="input"
                                            placeholder="Enter City"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="flex-column">
                                <label>Country. </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.address?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="country"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            className="input"
                                            placeholder="Enter Country"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="flex-column">
                                <label>Zipcode </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.zipcode?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="zipcode"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            className="input"
                                            placeholder="Enter Address"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="flex-column">
                                <label>Address. </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.address?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="address"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            className="input"
                                            placeholder="Enter Address"
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

export default Warehouse_Modal