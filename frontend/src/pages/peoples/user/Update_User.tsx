import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap';
import { Input } from '../../../components/component'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller, useFieldArray, } from 'react-hook-form'
import { DataService, Notify } from '../../../hooks/hook'
import Select from 'react-select'
import config from '../../../config/config'
import { useSelector } from 'react-redux';

interface Modal { show: boolean; handleClose: () => void, refreshTable: () => void }
interface Data {
    _id: string, name: string, phone: string, password: string, email: string, warehouses: [], permissions:
    { purchase: [], sales: [], customer: [], supplier: [], product: [] },
}

const defaultValues = { name: '', phone: '', password: '', email: '', purchase: [], sales: [], product: [], supplier: [], customer: [], warehousesId: [] }
const validationSchema = yup.object().shape({
    name: yup.string().required().matches(/^[A-Za-z\s]{1,30}$/, 'Name must be 1-30 characters long.'),
    email: yup.string().email().required().matches(/^[a-z0-9]+@gmail.com$/, 'Incorrect Email!'),
    phone: yup.string().required().matches(/^[0-9]{10}$/, 'Invalid Phone Number!'),
    warehousesId: yup.array().of(yup.object().shape({ name: yup.string().trim(), value: yup.string().trim() })),
    password: yup.string(),
    purchase: yup.array().of(yup.object().shape({ permission: yup.string(), value: yup.boolean() })),
    sales: yup.array().of(yup.object().shape({ permission: yup.string(), value: yup.boolean() })),
    product: yup.array().of(yup.object().shape({ permission: yup.string(), value: yup.boolean() })),
    customer: yup.array().of(yup.object().shape({ permission: yup.string(), value: yup.boolean() })),
    supplier: yup.array().of(yup.object().shape({ permission: yup.string(), value: yup.boolean() })),
})

const Update_User: React.FC<Modal> = ({ show, handleClose, refreshTable }) => {
    const { data }: { data: Data } = useSelector((state: any) => state.singleData)
    const [warehouseAccess, setwarehouseAccess] = useState(true)
    const [passwordtype, setpasswordtype] = useState(false)
    const [warehouses, setwarehouses] = useState([])
    const { control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })
    const { fields: purchasFields, remove: removePurchase, append: appendPurchase } = useFieldArray({ control, name: 'purchase' })
    const { fields: salesFields, remove: removeSales, append: appendSales } = useFieldArray({ control, name: 'sales' })
    const { fields: productFields, remove: removeProduct, append: appendProduct } = useFieldArray({ control, name: 'product' })
    const { fields: customerFields, remove: removeCustomer, append: appendcustomer } = useFieldArray({ control, name: 'customer' })
    const { fields: supplierFields, remove: removeSupplier, append: appendsupplier } = useFieldArray({ control, name: 'supplier' })


    const setWarehouseSelectBox = async () => {
        const res = await DataService.get('/warehouses')
        const warehouses = res?.map((item: any) => ({ value: item._id, label: item.name }))
        setwarehouses(warehouses)
    }

    const handleModalClose = () => { handleClose(), removePurchase(), removeSales(), removeProduct(), removeCustomer(), removeSupplier() }

    const registeration = async (formdata: object) => {
        try {
            const res = await DataService.put(`/user/${data._id}`, formdata, {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
            })
            if (res.success) handleModalClose(), refreshTable()
            Notify(res)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        setWarehouseSelectBox()
        data.warehouses?.length > 0 ? setwarehouseAccess(false) : setwarehouseAccess(true)
        setValue('name', data.name)
        setValue('email', data.email)
        setValue('phone', data.phone)
        appendPurchase(Object.entries(data.permissions?.purchase ?? {}).map(([key, value]) => ({ permission: key, value })))
        appendSales(Object.entries(data.permissions?.sales ?? {}).map(([key, value]) => ({ permission: key, value })))
        appendcustomer(Object.entries(data.permissions?.customer ?? {}).map(([key, value]) => ({ permission: key, value })))
        appendsupplier(Object.entries(data.permissions?.supplier ?? {}).map(([key, value]) => ({ permission: key, value })))
        appendProduct(Object.entries(data.permissions?.product ?? {}).map(([key, value]) => ({ permission: key, value })))
        setValue('warehousesId', data.warehouses?.map((item: any) => ({ value: item._id, label: item.name })))
    }, [data])
    return (
        <Modal
            show={show}
            size='lg'
            onHide={handleModalClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <h1>Edit User Details</h1>
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
                                            placeholder="Enter your phone no"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="flex-column">
                                <label>Set Password </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.password?.message ? 'inputError' : ''}`}>
                                <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg"><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" /><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" /></svg>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type={passwordtype ? 'text' : 'password'}
                                            className="input"
                                            placeholder="Enter Password"
                                            {...field}
                                        />
                                    )}
                                />
                                <svg onClick={() => setpasswordtype(!passwordtype)} viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <label>Access Warehouse </label>
                                    <span className='importantField'>*</span>
                                </div>
                                <div>
                                    <div className="form-check">
                                        <Input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={warehouseAccess}
                                            onClick={() => setwarehouseAccess(!warehouseAccess)}
                                        />
                                        <label className="form-check-label">All Warehouses</label>
                                    </div>
                                </div>
                            </div>
                            <div className={`inputForm ${errors.warehousesId?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="warehousesId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            isClearable
                                            isSearchable
                                            className='select'
                                            isRtl={false}
                                            isDisabled={warehouseAccess}
                                            placeholder='Select Warehouses'
                                            isMulti={true}
                                            options={warehouses}
                                            onChange={(selectedoption) => field.onChange(selectedoption)}
                                            styles={{ control: (style) => ({ ...style, boxShadow: 'none', border: 'none' }) }}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mb-2">
                            <div className="flex-column">
                                <label className='m-0'>Set Permission </label>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="d-flex gap-3 mb-2">
                                <div>
                                    <label className='mb-0'>Purchase : </label>
                                </div>
                                <div className="form-group d-flex flex-wrap gap-3 mb-0">
                                    {
                                        purchasFields.map((field, i) => (
                                            <div className="form-check" key={field.id}>
                                                <Controller
                                                    name={`purchase.${i}.value`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            checked={field.value}
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                <label className="form-check-label">{field.permission}</label>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="d-flex gap-3 mb-2">
                                <div>
                                    <label className='mb-0'>Sales : </label>
                                </div>
                                <div className="form-group d-flex flex-wrap gap-3 mb-0">
                                    {
                                        salesFields.map((field, i) => (
                                            <div className="form-check" key={field.id}>
                                                <Controller
                                                    name={`sales.${i}.value`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                <label className="form-check-label">{field.permission}</label>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="d-flex gap-3 mb-2">
                                <div>
                                    <label className='mb-0'>Product : </label>
                                </div>
                                <div className="form-group d-flex flex-wrap gap-3 mb-0">
                                    {
                                        productFields.map((field, i) => (
                                            <div className="form-check" key={field.id}>
                                                <Controller
                                                    name={`product.${i}.value`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            checked={field.value}
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                <label className="form-check-label">{field.permission}</label>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="d-flex gap-3 mb-2">
                                <div>
                                    <label className='mb-0'>Customers : </label>
                                </div>
                                <div className="form-group d-flex flex-wrap gap-3 mb-0">
                                    {
                                        customerFields.map((field, i) => (
                                            <div className="form-check" key={field.id}>
                                                <Controller
                                                    name={`customer.${i}.value`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            checked={field.value}
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                <label className="form-check-label">{field.permission}</label>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="d-flex gap-3">
                                <div>
                                    <label className='mb-0'>Supplier :</label>
                                </div>
                                <div className="form-group d-flex flex-wrap gap-3 mb-0">
                                    {
                                        supplierFields.map((field, i) => (
                                            <div className="form-check" key={field.id}>
                                                <Controller name={`supplier.${i}.value`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            checked={field.value}
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                <label className="form-check-label">{field.permission}</label>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button type='submit' className="button-submit" disabled={isSubmitting}>
                        Update
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    )
}
export default Update_User