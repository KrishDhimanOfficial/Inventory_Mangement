import { useEffect, useState } from 'react'
import JsBarcode from "jsbarcode"
import Select from 'react-select'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller, } from 'react-hook-form'
import { DataService, Notify } from '../../hooks/hook'
import { Input, Button, Section, Sec_Heading, TextArea } from '../../components/component'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import config from '../../config/config'

interface Data { _id: string }
const defaultValues = { title: '', image: '', price: 0, desc: '', sku: '', tax: 0, cost: 0, categoryId: '', brandId: '', unitId: '' }

const validationSchema = yup.object().shape({
    title: yup.string().required('required!').trim(),
    image: yup.mixed().required('upload Image!'),
    cost: yup.number().required('required!'),
    price: yup.number().required('required!'),
    tax: yup.number().required('required!'),
    desc: yup.string().trim(),
    categoryId: yup.object().required('required!'),
    brandId: yup.object().required('required!'),
    unitId: yup.object().required('required!'),
    sku: yup.string().required('required!').trim()
})

const Product = () => {
    const navigate = useNavigate()
    const [categories, setcategories] = useState([])
    const [brands, setbrands] = useState([])
    const [sku, setsku] = useState('')
    const [units, setunits] = useState([])
    const { data }: { data: Data } = useSelector((state: any) => state.singleData)

    const { control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const registeration = async (formdata: any) => {
        try {
            const formDataObj = new FormData()
            if (formdata.image && formdata.image.length > 0) {
                formDataObj.append('image', formdata.image[0])
            }
            formDataObj.append('title', formdata.title)
            formDataObj.append('price', formdata.price)
            formDataObj.append('desc', formdata.desc || '')
            formDataObj.append('sku', formdata.sku)
            formDataObj.append('tax', formdata.tax)
            formDataObj.append('cost', formdata.cost)
            formDataObj.append('categoryId', formdata.categoryId.value)
            formDataObj.append('brandId', formdata.brandId.value)
            formDataObj.append('unitId', formdata.unitId.value)

            const apiResponse = await fetch(`${config.serverURL}/product`, { method: 'POST', body: formDataObj })
            const res = await apiResponse.json()
            if (res.success) navigate('/dashboard/products')
            Notify(res); // Show API Response
        } catch (error) {
            console.error(error)
        }
    }

    const fetchCategories = async () => {
        const res = await DataService.get('/all/categories')
        const category = res.map((item: any) => ({ value: item._id, label: item.name }))
        setcategories(category)
    }

    const fetchBrands = async (option: { value: string }) => {
        const res = await DataService.get(`/all/brands/${option.value}`)
        const brands = res.map((item: any) => ({ value: item._id, label: item.name }))
        setbrands(brands)
    }

    const setUnits = async () => {
        const res = await DataService.get('/all/units')
        const units = res.map((item: any) => ({ value: item._id, label: item.name }))
        setunits(units)
    }

    const BarcodeGenerator = () => {
        let sku = '';
        for (let i = 0; i < 8; ++i) sku += Math.round(Math.random() * 9)
        setValue('sku', sku)
        setsku(sku)
        // Add a setTimeout to generate final barcode
        // JsBarcode(barcodeRef.current, '1237454', { format: "CODE39" });
    }

    useEffect(() => { fetchCategories(), setUnits() }, [])
    return (
        <>
            <Sec_Heading page="Add Product" subtitle="Products" />
            <Section>
                <div className="col-8">
                    <form onSubmit={handleSubmit(registeration)} className="form p-0 bg-transparent">
                        <div className="card">
                            <div className="card-body p-4">
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
                                        <div className={`inputForm ${errors.image?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="image"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="file"
                                                        className="input align-content-center"
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            if (e.target.files) {
                                                                field.onChange(e.target.files)
                                                            }
                                                        }}
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
                                                    options={categories}
                                                    onChange={(selectedoption: any) => {
                                                        field.onChange(selectedoption)
                                                        fetchBrands(selectedoption)
                                                    }}
                                                    styles={{
                                                        control: (style) => ({
                                                            ...style,
                                                            border: errors.categoryId?.message ? '1px solid red' : ''
                                                        })
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="flex-column">
                                            <label>Brand </label>
                                            <span className='importantField'>*</span>
                                        </div>
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
                                                    options={brands}
                                                    onChange={(selectedoption) => field.onChange(selectedoption)}
                                                    styles={{
                                                        control: (style) => ({
                                                            ...style,
                                                            border: errors.brandId?.message ? '1px solid red' : ''
                                                        })
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    {/* Tax */}
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
                                    {/* Product code (sku) */}
                                    <div className="col-md-6">
                                        <div className="flex-column">
                                            <label>SKU Code </label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={`inputForm ${errors.sku?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="sku"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        className="input"
                                                        placeholder="Enter SKU Code"
                                                        min={0}
                                                        max={100}
                                                        value={sku}
                                                    />
                                                )}
                                            />
                                            <Button
                                                className='btn h-100'
                                                icon={<i className="fa-solid fa-barcode"></i>}
                                                onclick={() => BarcodeGenerator()}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Desc */}
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <div className="flex-column">
                                            <label>Description </label>
                                        </div>
                                        <div className={`inputForm h-auto ps-0`}>
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
                        <div className="card">
                            <div className="card-body p-4">
                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <div className="flex-column">
                                            <label>Product Cost </label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={`inputForm ${errors.cost?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="cost"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="number"
                                                        className="input"
                                                        placeholder="Enter Product cost"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="flex-column">
                                            <label>Product Price </label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={`inputForm ${errors.price?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="price"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="number"
                                                        className="input"
                                                        placeholder="Enter Product price"
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
                                            <label>Product Unit</label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <Controller
                                            name="unitId"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    isClearable
                                                    isSearchable
                                                    className='select'
                                                    isRtl={false}
                                                    placeholder='Select unit Name'
                                                    options={units}
                                                    onChange={(selectedoption) => field.onChange(selectedoption)}
                                                    styles={{
                                                        control: (style) => ({
                                                            ...style,
                                                            border: errors.unitId?.message ? '1px solid red' : ''
                                                        })
                                                    }}
                                                />
                                            )}
                                        />
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

export default Product