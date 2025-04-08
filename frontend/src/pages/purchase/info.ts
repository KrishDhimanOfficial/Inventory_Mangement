import * as yup from 'yup'

export interface Option { value: string, label: string }
export interface Searches { _id: string, sku: string, name: string, }
export const defaultValues = { supplierId: '', warehouseId: '', orderItems: [], shipping: 0, orderTax: 0, total: 0, discount: 0, note: '', pruchaseDate: new Date() }
export const validationSchema = yup.object().shape({
    pruchaseDate: yup.date().required('required!'),
    supplierId: yup.object().required('required!'),
    warehouseId: yup.object().required('required!'),
    note: yup.string(),
    orderTax: yup.number(),
    total: yup.number(),
    orderItems: yup.array(),
    discount: yup.number(),
    shipping: yup.number()
})
