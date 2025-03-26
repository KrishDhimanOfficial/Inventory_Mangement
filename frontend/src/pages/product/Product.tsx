import React, { useEffect, useState, useRef } from 'react'
import JsBarcode from "jsbarcode"
import Select from 'react-select'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller, } from 'react-hook-form'
import { DataService, Notify } from '../../hooks/hook'
import { Input, Button, Section, Sec_Heading, TextArea } from '../../components/component'
import { useSelector } from 'react-redux'

interface Data { _id: string, name: string, address: string, country: string, city: string, phone: string, email: string, }

const defaultValues = { title: '' }
const validationSchema = yup.object().shape({
    title: yup.string().required('required!'),
    image: yup.string().required('img required!'),
    price: yup.number().required('required!'),
    tax: yup.number().required('required!'),
    desc: yup.string().required('required!'),
    categoryId: yup.string().required('required!'),
    brandId: yup.string().required('required!'),
})


const Product_Modal = () => {
    const [categories, setcategories] = useState([])
    const [brands, setbrands] = useState([])
    const { data }: { data: Data } = useSelector((state: any) => state.singleData)

    const { control, reset, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const registeration = async (formdata: object) => {
        try {
            const res = data._id
                ? await DataService.put(`/product/${data._id}`, formdata)
                : await DataService.post('/product', formdata)
            Notify(res) // Show API Response
            if (!data._id) reset()
        } catch (error) {
            console.error(error)
        }
    }

    const fetchCategories = async () => {
        const res = await DataService.get('/all/categories')
        const category = res.map((item: any) => ({ value: item._id, label: item.name }))
        setcategories(category)
    }

    const fetchBrands = async () => {
        const res = await DataService.get('/all/brands')
        const brands = res.map((item: any) => ({ value: item._id, label: item.name }))
        setbrands(brands)
    }

    useEffect(() => { fetchCategories(), fetchBrands() }, [])
    return (
        <>
            <Sec_Heading page="Add Product" subtitle="Products" />
            <Section>
                <div className="col-8">
                    <form onSubmit={handleSubmit(registeration)} className="form p-0 bg-transparent">
                        <div className="card">
                            <div className="card-body">
                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <div className="flex-column">
                                            <label>Name </label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={`inputForm ${errors.title?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="title"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="text"
                                                        className="input"
                                                        placeholder="Enter Product Name"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="flex-column">
                                            <label>Product Image </label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={`inputForm `}>
                                            <Controller
                                                name="image"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="file"
                                                        className="input align-content-center"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <div className="flex-column">
                                            <label>Category </label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={``}>
                                            <Controller
                                                name="categoryId"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        isClearable
                                                        isSearchable
                                                        className='select'
                                                        isRtl={false}
                                                        placeholder='Select Category Name'
                                                        isMulti={true}
                                                        options={categories}
                                                        onChange={(selectedoption) => field.onChange(selectedoption)}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="flex-column">
                                            <label>Brand </label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={``}>
                                            <Controller
                                                name="brandId"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        isClearable
                                                        isSearchable
                                                        className='select'
                                                        isRtl={false}
                                                        placeholder='Select Brand Name'
                                                        isMulti={true}
                                                        options={brands}
                                                        onChange={(selectedoption) => field.onChange(selectedoption)}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <div className="flex-column">
                                            <label>Tax (%) </label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={`inputForm ${errors.tax?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="tax"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="number"
                                                        className="input"
                                                        placeholder="Enter Tax (%)"
                                                        min={0}
                                                        max={100}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="flex-column">
                                            <label>Description </label>
                                        </div>
                                        <div className='inputForm h-auto ps-0'>
                                            <Controller
                                                name="desc"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="textarea-wrapper">
                                                        <TextArea
                                                            className="adjustable-textarea w-100"
                                                            placeholder="Enter desc (Optional)"
                                                            {...field}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
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
                                    text={isSubmitting ? 'Adding...' : 'Add Product'}
                                />)
                        }
                    </form>
                </div>
            </Section>
        </>
    )
}

export default Product_Modal