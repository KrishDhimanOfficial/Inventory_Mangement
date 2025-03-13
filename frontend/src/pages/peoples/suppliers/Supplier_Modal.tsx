import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller, } from 'react-hook-form'
import { DataService, Notify } from '../../../hooks/hook'
import { Input, Button } from '../../../components/component'
import { useSelector } from 'react-redux'

interface Modal { show: boolean; handleClose: () => void }
interface Data { _id: string, name: string, address: string, country: string, city: string, phone: string, email: string, }

const defaultValues = { name: '', phone: '', email: '', country: '', city: '', address: '' }
const validationSchema = yup.object().shape({
    name: yup.string().required().matches(/^[A-Za-z\s]{1,30}$/, 'Name must be 1-30 characters long.'),
    email: yup.string().email().required().matches(/^[a-z0-9]+@gmail.com$/, 'Incorrect Email!'),
    phone: yup.string().required().matches(/^[0-9]{10}$/, 'Invalid Phone Number!'),
    country: yup.string().required().matches(/^[A-Za-z\s]{1,30}$/, 'Invalid Country Name.'),
    city: yup.string().required().matches(/^[A-Za-z\s]{1,30}$/, 'Invalid City Name.'),
    address: yup.string().required(),
})

const Supplier_Modal: React.FC<Modal> = ({ show, handleClose }) => {
    const { data }: { data: Data } = useSelector((state: any) => state.singleData)

    const { control, reset, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const registeration = async (formdata: object) => {
        try {
            const res = data._id
                ? await DataService.put(`/supplier/${data._id}`, formdata)
                : await DataService.post('/supplier', formdata)
            if (!data._id) reset()
            Notify(res) // Show API Response
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
            setValue('email', data.email)
            setValue('country', data.country)
            setValue('phone', data.phone)
        }
    }, [data])

    return (
        <Modal
            show={show}
            size='lg'
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <h1>{data?._id ? 'Edit Supplier Details' : 'Add Supplier'}</h1>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(registeration)} className="form p-0">
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
                                            placeholder="Enter your Name"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="flex-column">
                                <label>Email </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.email?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            className="input"
                                            placeholder="Enter your Email"
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
                                <label>Phone no. </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.phone?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            className="input"
                                            placeholder="Enter Supplier phone no"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="flex-column">
                                <label>City. </label>
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
                                            placeholder="Enter Supplier City"
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
export default Supplier_Modal