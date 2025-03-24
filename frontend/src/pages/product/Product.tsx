import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller, } from 'react-hook-form'
import { DataService, Notify } from '../../hooks/hook'
import { Input, Button, Section } from '../../components/component'
import { useSelector } from 'react-redux'

interface Data { _id: string, name: string, address: string, country: string, city: string, phone: string, email: string, }

const defaultValues = {}
const validationSchema = yup.object().shape({})


const Product_Modal = () => {
    const { data }: { data: Data } = useSelector((state: any) => state.singleData)

    const { control, reset, setValue, handleSubmit } = useForm({
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

    return (
        <Section>
            <h1>Add</h1>
        </Section>
    )
}

export default Product_Modal