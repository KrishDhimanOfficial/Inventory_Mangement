import { useEffect, useState,useRef } from 'react'
import { motion } from 'motion/react'
import JsBarcode from "jsbarcode"
import Select from 'react-select'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { DataService, Notify, useFetchData } from '../../hooks/hook'
import { Input, Button, Section, Sec_Heading, TextArea, Image } from '../../components/component'
import { useNavigate, useParams } from 'react-router'
import config from '../../config/config'

const defaultValues = { title: '', image: '', price: 0, desc: '', sku: '', tax: 0, cost: 0, categoryId: '', brandId: '', unitId: '', supplierId: '' }
interface Option { value: string, label: string }
const animation = { opacity: [0, 1], x: [20, 0], transition: { duration: 1 } }
const fadeOut = { opacity: [0, 1], transition: { duration: 0.8 } }

const validationSchema = yup.object().shape({
    title: yup.string().required('required!').trim(),
    image: yup.mixed().required('upload Image!'),
    cost: yup.number().required('required!'),
    price: yup.number().required('required!'),
    tax: yup.number(),
    desc: yup.string().trim(),
    categoryId: yup.object().required('required!'),
    brandId: yup.object().required('required!'),
    supplierId: yup.object().required('required!'),
    unitId: yup.object().required('required!'),
    sku: yup.string().required('required!').trim()
})

const Product = () => {
    const barcodeRef = useRef(null)
    const { id } = useParams()
    const navigate = useNavigate()
    const [categories, setcategories] = useState([])
    const [brands, setbrands] = useState([])
    const [sku, setsku] = useState('')
    const [prevImage, setprevImage] = useState('')
    const [units, setunits] = useState([])
    const [suppliers, setsuppliers] = useState([])
    const [selectedOption, setSelectedOption] = useState<Option | null>(null)
    const [brandOption, setBrandOption] = useState<Option | null>(null)
    const [unitOption, setUnitOption] = useState<Option | null>(null)
    const [supplierOption, setSupplierOption] = useState<Option | null>(null)


    const { apiData: productData, fetchData: fetchProduct }: {
        apiData: any,
        fetchData: (api: string) => Promise<void>
    } = useFetchData({})

    const { control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const displayFImgs = (e: any) => {
        const file = e.target.files[0]
        setprevImage(URL.createObjectURL(file))
    }

    const fetchBrand_unit_by_category_Id = async (id: string) => {
        try {
            const [brandsRes, unitRes] = await Promise.all([
                DataService.get(`/all/brands/${id}`),
                DataService.get(`/all/units/${id}`)
            ])
            setbrands(brandsRes.map((item: any) => ({ value: item.brand?._id, label: item.brand?.name })))
            setunits(unitRes.map((item: any) => ({ value: item._id, label: item.name })))
        } catch (error) {
            console.error(error)
        }
    }

    const fetchCategory_Supplier = async () => {
        try {
            const [categoryRes, suppliersRes] = await Promise.all([
                DataService.get('/all/categories'),
                DataService.get('/all/supplier-details')
            ])
            setcategories(categoryRes.map((item: any) => ({ value: item?._id, label: item?.name })))
            setsuppliers(suppliersRes.map((item: any) => ({ value: item._id, label: item.name })))
        } catch (error) {
            console.error(error)
        }
    }

    const BarcodeGenerator = () => {
        let sku = '';
        for (let i = 0; i < 8; ++i) sku += Math.round(Math.random() * 9)
        setValue('sku', sku)
        setsku(sku)

        // Add a setTimeout to generate final barcode
        setTimeout(() => {
            JsBarcode(barcodeRef.current, sku, { format: "CODE39" });
        }, 0)
    }

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
            formDataObj.append('supplierId', formdata.supplierId.value)

            const apiResponse = id // Use For PUT & POST Operation
                ? await fetch(`${config.serverURL}/product/${id}`, { method: 'PUT', body: formDataObj })
                : await fetch(`${config.serverURL}/product`, { method: 'POST', body: formDataObj })
            const res = await apiResponse.json()
            if (res.success) navigate('/dashboard/products')
            Notify(res) // Show API Response
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetchCategory_Supplier() }, [])
    useEffect(() => { if (id) fetchProduct(`/product/${id}`) }, [])
    useEffect(() => {
        if (productData && id) {
            setValue('title', productData.title)
            setValue('tax', productData.tax)
            setValue('desc', productData.desc)
            setValue('price', productData.price)
            setValue('cost', productData.cost)
            setValue('sku', productData.sku)
            setprevImage(productData.image)

            const categoryOption = id
                ? { value: productData.category._id, label: productData.category.name } : null
            const brandOption = id
                ? { value: productData.brand._id, label: productData.brand.name } : null
            const unitOption = id
                ? { value: productData.unit._id, label: productData.unit.name } : null
            const supplierOption = id
                ? { value: productData.supplier._id, label: productData.supplier.name } : null

            setValue('categoryId', categoryOption || {})
            setValue('brandId', brandOption || {})
            setValue('unitId', unitOption || {})
            setValue('supplierId', supplierOption || {})

            // Update local state for controlled component
            setsku(productData.sku), setSelectedOption(categoryOption),
                setBrandOption(brandOption), setUnitOption(unitOption),
                setSupplierOption(supplierOption)
        } else {
            setsku(''), setSelectedOption(null), setBrandOption(null), setUnitOption(null)
        }
    }, [productData, id])

    return (
        <>
            <Sec_Heading page={id ? "Edit Product Details" : "Add Product"} subtitle="Product" />
            <Section>
                <div className="col-8">
                    <form onSubmit={handleSubmit(registeration)} className="form p-0 bg-transparent">
                        <motion.div animate={fadeOut} className="card">
                            <div className="card-body p-4">
                                <motion.div animate={animation} className="row mb-2">
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
                                                                displayFImgs(e)
                                                                field.onChange(e.target.files)
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div animate={animation} className="row mb-2">
                                    <div className="col-md-6">
                                        <div className="flex-column">
                                            <label>Category </label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={`inputForm ${errors.categoryId?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="categoryId"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        value={field.value || selectedOption}
                                                        isClearable
                                                        isSearchable
                                                        className='select'
                                                        isRtl={false}
                                                        placeholder='Select Category Name'
                                                        options={categories}
                                                        onChange={(selectedoption: any) => {
                                                            field.onChange(selectedoption)
                                                            fetchBrand_unit_by_category_Id(selectedoption.value)
                                                        }}
                                                        styles={{ control: (style) => ({ ...style, boxShadow: 'none', border: 'none' }) }}
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
                                        <div className={`inputForm ${errors.brandId?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="brandId"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        value={field.value || brandOption}
                                                        isClearable
                                                        isSearchable
                                                        className='select'
                                                        isRtl={false}
                                                        placeholder='Select Brand Name'
                                                        options={brands}
                                                        onChange={(selectedoption) => field.onChange(selectedoption)}
                                                        styles={{ control: (style) => ({ ...style, boxShadow: 'none', border: 'none' }) }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div animate={animation} className="row mb-2">
                                    {/* Tax */}
                                    <div className="col-md-6">
                                        <div className="flex-column">
                                            <label>Tax (%) Like GST</label>
                                            {/* <span className='importantField'>*</span> */}
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
                                </motion.div>
                                {/* Desc */}
                                <motion.div animate={animation} className="row mb-2">
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
                                </motion.div>
                            </div>
                        </motion.div>
                        <motion.div animate={fadeOut} className="card">
                            <div className="card-body p-4">
                                <motion.div animate={animation} className="row mb-2">
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
                                            <label>Selling Price</label>
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
                                </motion.div>
                                <motion.div animate={animation} className="row mb-2">
                                    <div className="col-md-6">
                                        <div className="flex-column">
                                            <label>Product Unit</label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={`inputForm ${errors.unitId?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="unitId"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        value={field.value || unitOption}
                                                        isClearable
                                                        isSearchable
                                                        className='select'
                                                        isRtl={false}
                                                        placeholder='Select unit Name'
                                                        options={units}
                                                        onChange={(selectedoption) => field.onChange(selectedoption)}
                                                        styles={{ control: (style) => ({ ...style, boxShadow: 'none', border: 'none' }) }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="flex-column">
                                            <label>Supplier</label>
                                            <span className='importantField'>*</span>
                                        </div>
                                        <div className={`inputForm ${errors.supplierId?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="supplierId"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        value={field.value || supplierOption}
                                                        isClearable
                                                        isSearchable
                                                        className='select'
                                                        isRtl={false}
                                                        placeholder='Select Your Supplier'
                                                        options={suppliers}
                                                        onChange={(selectedoption) => field.onChange(selectedoption)}
                                                        styles={{ control: (style) => ({ ...style, boxShadow: 'none', border: 'none' }) }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                        {
                            id
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
                <div className="col-4">
                    <div className="card">
                        <div className="card-body">
                            <h3 className='text-center'>Preview Image</h3>
                            <div className='text-center'>
                                {
                                    prevImage && (<Image path={prevImage} className='img-fluid object-fit-cover' />)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )
}

export default Product