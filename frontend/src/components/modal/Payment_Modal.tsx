import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Input, Button } from '../component'
import { DataService, Notify } from '../../hooks/hook';
import { useForm, Controller } from 'react-hook-form'
import { Col, Row } from 'react-bootstrap';
import Select from 'react-select'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Big from 'big.js';

interface Modal {
    endApi: string,
    show: boolean;
    handleClose: () => void
    refreshTable: () => void
}
const validationSchema = yup.object().shape({
    paid: yup.number().required('required.'),
    paymentId: yup.object().required('required.'),
    due: yup.number(),
    pStatus: yup.object().required('required!')
})
const pStatus = [{ label: 'paid', value: 'paid' }, { label: 'parital', value: 'parital' }, { label: 'unpaid', value: 'unpaid' }]
const defaultValues = { paid: 0, due: 0, paymentId: '', pStatus: '' }

const Payment_Modal: React.FC<Modal> = ({ endApi, show, handleClose, refreshTable }) => {
    const [payment_methods, setpayment_methods] = useState([])
    const [balanceamount, setbalanceamount] = useState(0)
    const [statusOption, setstatusOption] = useState({ label: 'Select ', value: 0 })
    const [method, setmethod] = useState({ label: 'Select ', value: 0 })
    const { data }: { data: any } = useSelector((state: any) => state.singleData)
    const { control, reset, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const fetch = async () => {
        try {
            const res = await DataService.get('/get-all-payment-methods')
            setpayment_methods(res?.map((item: any) => ({ value: item._id, label: item.name })))
        } catch (error) {
            console.error(error)
        }
    }

    const handlepay = (amount: number) => {
        if (amount > data.payment_due) toast.warning('Amount is greater than due amount')
        setbalanceamount(parseFloat(Big(data.payment_due).minus(amount).toFixed(2)))
        setValue('paid', parseFloat(Big(amount).toFixed(2)))
        setValue('due', parseFloat(Big(data.payment_due).toFixed(2)))
    }

    const updatePatchRequest = async (formdata: any) => {
        try {
            if (formdata.paid > data.payment_due) {
                toast.warning('Amount is greater than due amount')
            } else {
                const res = await DataService.patch(`${endApi}/${data._id}`, formdata)
                Notify(res) // Show API Response
                if (res.success) reset(), refreshTable(), handleClose()
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [])
    useEffect(() => {
        if (data?._id) {
            const payment = { value: data.payment?._id, label: data.payment?.name }
            setmethod(payment)
            setValue('due', parseFloat(Big(data.payment_due).plus(0).toFixed(2)))
            setValue('paymentId', payment || { value: 0, label: 'Select' })
            setValue('pStatus', { label: data.payment_status, value: data.payment_status })
            setstatusOption({ label: data.payment_status, value: data.payment_status })
            setbalanceamount(parseFloat((data.total - data.payment_paid).toFixed(2)))
        }
    }, [data, setValue, reset])
    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size='lg'
        >
            <Modal.Header closeButton>
                <Modal.Title>Create Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <form onSubmit={handleSubmit(updatePatchRequest)} className="form p-0">
                    <Row className='mb-3'>
                        <Col md='4'>
                            <div className="flex-column">
                                <label>Date </label>
                            </div>
                            <div className={`inputForm`} >
                                {data.date}
                            </div>
                        </Col>
                        <Col md='4'>
                            <div className="flex-column">
                                <label>Referernce </label>
                            </div>
                            <div className={`inputForm`}>
                                {data.purchaseId || data.salesId}
                            </div>
                        </Col>
                        <Col md='4'>
                            <div className="flex-column">
                                <label>Payment Choice </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.paymentId?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="paymentId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={payment_methods}
                                            value={field.value || method}
                                            isClearable
                                            isSearchable
                                            className='select'
                                            isRtl={false}
                                            placeholder='Select payment'
                                            onChange={(selectedoption: any) => {
                                                field.onChange(selectedoption)
                                                setmethod(selectedoption)
                                            }}
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
                                                control: (base: any) => ({
                                                    ...base,
                                                    boxShadow: 'none',
                                                    border: 'none',
                                                }),
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row className='mb-3'>
                        <Col md='4'>
                            <div className="flex-column">
                                <label>Enter Amount </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.paid?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="paid"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            className="input"
                                            onFocus={() => setValue('paid', 0)}
                                            onChange={(e: any) => handlepay(e.target.value)}
                                        />
                                    )}
                                />
                            </div>
                        </Col>
                        <Col md='4'>
                            <div className="flex-column">
                                <label>Due Amount</label>
                            </div>
                            <div className={`inputForm`}>
                                {data.payment_due}
                            </div>
                        </Col>
                        <Col md='4'>
                            <div className="flex-column">
                                <label>Balance Amount </label>
                            </div>
                            <div className={`inputForm`}>
                                {balanceamount}
                            </div>
                        </Col>
                    </Row>
                    <Row className='mb-3'>
                        <Col md='4'>
                            <div className="flex-column">
                                <label>Payment Status </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.pStatus?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="pStatus"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={pStatus}
                                            value={field.value || statusOption}
                                            isClearable
                                            isSearchable
                                            className='select'
                                            isRtl={false}
                                            placeholder='Select payment'
                                            onChange={(selectedoption: any) => {
                                                field.onChange(selectedoption)
                                                setstatusOption(selectedoption)
                                            }}
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
                                                control: (base: any) => ({
                                                    ...base,
                                                    boxShadow: 'none',
                                                    border: 'none',
                                                }),
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='4' className='offset-md-8'>
                            <Button
                                type='submit'
                                className='button-submit'
                                disabled={isSubmitting}
                                text={isSubmitting ? 'Submit...' : 'Submit'}
                            />
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default React.memo(Payment_Modal)