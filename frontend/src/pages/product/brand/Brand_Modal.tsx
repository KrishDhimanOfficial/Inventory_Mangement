import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { Input, Button } from '../../../components/component'
import * as yup from 'yup'
import { DataService, Notify } from '../../../hooks/hook'
import { useSelector } from 'react-redux'
import Select from 'react-select'

interface Modal { show: boolean; handleClose: () => void, refreshTable: () => void }
interface Data { _id: string, name: string, category: { _id: string, name: string } }
interface Option { value: string, label: string }

const defaultValues = { name: '', categoryId: '' }
const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required').trim(),
    categoryId: yup.object().required('Category is Required!')
})

const Brand_Modal: React.FC<Modal> = ({ show, handleClose, refreshTable }) => {
    const [categories, setcategories] = useState<Option[]>([])
    const [selectedOption, setSelectedOption] = useState<Option | null>(null)
    const { data }: { data: Data } = useSelector((state: any) => state.singleData)
    const { control, reset, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const registeration = async (formdata: object) => {
        try {
            const res = data?._id
                ? await DataService.put(`/brand/${data._id}`, formdata)
                : await DataService.post('/brand', formdata)
            Notify(res) // Show API Response
            if (!data._id) reset()
            if (res.success) refreshTable()
        } catch (error) {
            console.error(error)
        }
    }

    const fetchCategories = async () => {
        const res = await DataService.get('/all/categories')
        const category = res.map((item: any) => ({ value: item._id, label: item.name }))
        setcategories(category)
    }

    useEffect(() => { fetchCategories() }, [])

    // Set form values when editing existing data
    useEffect(() => {
        if (data?._id) {
            const categoryOption = data.category?._id
                ? { value: data.category._id, label: data.category.name }
                : null

            setValue('name', data.name || '')
            setValue('categoryId', categoryOption || {})

            // Update local state for controlled component
            setSelectedOption(categoryOption)
        } else {
            // Reset when adding new
            reset(defaultValues)
            setSelectedOption(null)
        }
    }, [data, setValue, reset])

    // Reset on modal close
    const handleModalClose = () => {
        handleClose()
        if (!data?._id) reset(defaultValues), setSelectedOption(null)
    }

    return (
        <Modal
            show={show}
            onHide={handleModalClose}
            backdrop='static'
            keyboard={false}
        >
            <Modal.Header closeButton>
                <h1>{data?._id ? 'Edit Brand' : 'Add Brand'}</h1>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(registeration)} className="form p-0">
                    <div className="row">
                        <div className="col-md-12 mb-2">
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
                                            placeholder="Enter Brand Name"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="flex-column">
                                <label>Category </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className='w-100'>
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value || selectedOption}
                                            isClearable
                                            isSearchable
                                            options={categories}
                                            placeholder="Select Brand Category"
                                            onChange={(option) => {
                                                field.onChange(option)
                                                setSelectedOption(option as Option)
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
                        </div>
                    </div>
                    {
                        data?._id
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

export default Brand_Modal