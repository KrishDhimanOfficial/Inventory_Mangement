import React, { useEffect, useState } from 'react';
import { Section, Sec_Heading, Input, Button, TextArea } from '../../../components/component'
import { Col, Card, Row } from 'react-bootstrap'
import { useForm, Controller, } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Select from 'react-select'
import * as yup from 'yup'
import currencyCodes from 'currency-codes'
import getSymbolFromCurrency from 'currency-symbol-map'
import { Notify } from '../../../hooks/hook'
import config from '../../../config/config'
import { useSelector } from 'react-redux'

const defaultValues = {
    name: '',
    logo: '',
    email: '',
    phone: '',
    currency: { label: '', value: '' },
    address: '',
}

const validationSchema = yup.object().shape({
    logo: yup.mixed().required('required!'),
    name: yup.string().required('required!').trim().matches(/^[A-Za-z0-9\s]{1,30}$/, 'Name must be 1-25 characters long.'),
    email: yup.string().email().required('required!').trim().matches(/^[a-z0-9]+@gmail.com$/, 'Incorrect Email!'),
    phone: yup.string().required().trim().matches(/^[0-9]{10}$/, 'Invalid Phone Number!'),
    address: yup.string().trim(),
    currency: yup.object().shape({
        label: yup.string().trim().required('required!'),
        value: yup.string().trim().required('required!'),
    })
})

const System_Setting = () => {
    const { settings } = useSelector((state: any) => state.singleData)
    const [selectedOption, setselectedOption] = useState({})
    const [currencies, setcurrencies] = useState([{ label: '', value: '' }])

    const { control, reset, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues, resolver: yupResolver(validationSchema)
    })

    const submitData = async (formdata: any) => {
        try {
            const form = new FormData()
            form.append('logo', formdata.logo[0])
            Object.entries(formdata).forEach(([key, value]) => form.append(key, JSON.stringify(value as string)))

            const apiResponse = await fetch(`${config.serverURL}/system-setting`, { method: 'PUT', body: form })
            const res = await apiResponse.json()
            Notify(res)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const currencyList = currencyCodes.data?.map(curr => ({
            label: curr.currency,
            value: getSymbolFromCurrency(curr.code) || 'N/A',
        }))
        setcurrencies(currencyList)
    }, [])

    useEffect(() => {
        setValue('name', settings.name)
        setValue('email', settings.email)
        setValue('phone', settings.phone)
        setValue('address', settings.address)
        setValue('currency', settings.currency)
        setselectedOption(settings.currency)
    }, [settings])
    return (
        <>
            <Sec_Heading page='System Setting' subtitle='settings' />
            <Section>
                <Col>
                    <Card>
                        <Card.Body>
                            <form onSubmit={handleSubmit(submitData)} className="form p-0">
                                <Row className="row">
                                    <Col md='4'>
                                        <div className="flex-column">
                                            <label>Company Name </label>
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
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    <Col md='4'>
                                        <div className="flex-column">
                                            <label>Company Email </label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={`inputForm ${errors.email?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="email"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="email"
                                                        className="input"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    <Col md='4'>
                                        <div className="flex-column">
                                            <label>Company Logo </label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={`inputForm ${errors.logo?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="logo"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="file"
                                                        className="input align-content-center"
                                                        onChange={(e: any) => {
                                                            if (e.target.files) field.onChange(e.target.files)
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="row">
                                    <Col md='4'>
                                        <div className="flex-column">
                                            <label>Currency </label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={`inputForm ${errors.currency?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="currency"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        value={field.value || selectedOption}
                                                        isClearable
                                                        isSearchable
                                                        className='select'
                                                        isRtl={false}
                                                        placeholder='Select Base Currency'
                                                        options={currencies}
                                                        onChange={(selectedoption: any) => {
                                                            field.onChange(selectedoption)
                                                            setselectedOption(selectedoption)
                                                        }}
                                                        styles={{ control: (style: any) => ({ ...style, boxShadow: 'none', border: 'none' }) }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    <Col md='4'>
                                        <div className="flex-column">
                                            <label>Company Phone </label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={`inputForm ${errors.phone?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="phone"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="number"
                                                        className="input align-content-center"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="flex-column">
                                            <label>Address </label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={`inputForm h-auto ps-0 ${errors.address?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="address"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="textarea-wrapper">
                                                        <TextArea
                                                            {...field}
                                                            className="adjustable-textarea w-100 h-100"
                                                            onChange={(e: any) => field.onChange(e)}
                                                            value={field.value}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Button
                                    type='submit'
                                    className='button-submit w-25'
                                    disabled={isSubmitting}
                                    text={isSubmitting ? 'submitting...' : 'Submit'}
                                />
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Section>
        </>
    )
}

export default System_Setting