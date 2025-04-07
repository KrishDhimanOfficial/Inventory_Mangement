import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { Input, Button } from '../../../components/component'
import * as yup from 'yup'
import { DataService, Notify } from '../../../hooks/hook'
import { useSelector } from 'react-redux';
import Select from 'react-select';

interface Modal { show: boolean; handleClose: () => void, refreshTable: () => void }
interface Data { _id: string, name: string, unitId: [{ _id: string, name: string }] }

const defaultValues = { name: '', unitId: [] }
const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required').trim(),
    unitId: yup.array().required('Required!')
})

const Category_Modal: React.FC<Modal> = ({ show, handleClose, refreshTable }) => {
    const { data }: { data: Data } = useSelector((state: any) => state.singleData)
    const [units, setunits] = useState([])

    const { control, reset, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const setUnits = async () => {
        const res = await DataService.get('/all/units')
        const units = res.map((item: any) => ({ value: item._id, label: item.name }))
        setunits(units)
    }

    const registeration = async (formdata: object) => {
        try {
            const res = data?._id
                ? await DataService.put(`/category/${data._id}`, formdata)
                : await DataService.post('/category', formdata)
            Notify(res) // Show API Response
            if (!data._id) reset()
            if (res.success) refreshTable(), handleClose()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { if (data) setValue('name', data.name) }, [])
    useEffect(() => { setUnits() }, [])
    return (
        <Modal
            show={show}
            // size='lg'
            onHide={handleClose}
            backdrop='static'
            keyboard={false}
        >
            <Modal.Header closeButton>
                <h1>{data?._id ? 'Edit Category' : 'Add Category'}</h1>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(registeration)} className="form p-0">
                    <div className="row">
                        <div className="col-md-12 mb-3">
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
                                            placeholder="Enter Category"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="flex-column">
                                <label>Select Category Units </label>
                                <span className='importantField'>*</span>
                            </div>
                            <div className={`inputForm ${errors.name?.message ? 'inputError' : ''}`}>
                                <Controller
                                    name="unitId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            // value={field.value || selectedOption}
                                            isClearable
                                            isSearchable
                                            isMulti
                                            options={units}
                                            placeholder="Select Units"
                                            onChange={(option: any) => {
                                                field.onChange(option)
                                                // setSelectedOption(option)
                                            }}
                                            styles={{ control: (style: any) => ({ ...style, boxShadow: 'none', border: 'none' }) }}
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

export default Category_Modal