import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Sec_Heading, Section, Button, Loader, Static_Modal, } from '../../components/component'
import { DataService, downloadCSV, generatePDF, } from '../../hooks/hook'
// import DataTable from 'react-data-table-component'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import JsBarcode from "jsbarcode"
import DataTable from '../../components/Datatable/DataTable'
interface ProductSchema {
    id: number,
    name: string,
    update: string,
    _id: string
    title: string,
    image: string,
    sku: string,
    code: string,
    cost: number,
    price: number,
    tax: number,
    desc: string,
    year: string,
    month: string,
    day: string,
    category: { name: string },
    brand: { name: string },
    unit: { shortName: string }
}

const Products = () => {
    const barcodeRef = useRef<any>(null)
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [warnModal, setwarnmodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [Id, setId] = useState('')
    const { permission } = useSelector((state: any) => state.permission)

    const columns = [
        { accessorKey: 'id', header: 'ID', },
        { accessorKey: 'code', header: 'Code' },
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'category', header: 'Category' },
        { accessorKey: 'brand', header: 'Brand' },
        {
            header: 'Actions',
            accessorFn: (row: any) => (
                <div className="d-flex gap-2 p-2 justify-content-between">
                    {
                        permission.product?.edit && (
                            <Link to={`/dashboard/product/${row._id}`} state={{ from: location.pathname }} className='btn btn-dark btn-sm bg-transparent text-dark h-fit'>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </Link>
                        )
                    }
                    <Button text=''
                        onclick={() => { deleteTableRow(row._id) }}
                        className='btn btn-dark btn-sm bg-transparent text-dark h-fit' icon={<i className="fa-solid fa-trash"></i>}
                    />
                    {
                        permission.product?.create && (
                            <Button text=''
                                // onclick={() => printBarcode(row.code)}
                                className='btn btn-dark btn-sm bg-transparent text-dark h-fit' icon={<i className="fa-solid fa-print"></i>}
                            />
                        )
                    }
                </div>
            ),
        }
    ]

    const tableBody = data.map((product: ProductSchema) => [
        product.id,
        product.code,
        product.name,
        product.category,
        product.brand,
    ])
    const tableHeader = ["S.No", "SKU", "Title", "Category", "Brand"]
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get('/all/products')
            const response = res?.map((pro: ProductSchema, i: number) => ({
                id: i + 1,
                _id: pro._id,
                code: pro.sku,
                name: pro.title,
                brand: pro.brand?.name,
                category: pro.category?.name,
            }))
            setdata(response)
            setloading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [!refreshTable])
    return (
        <>
            {/* <svg ref={barcodeRef}  /> */}
            <Static_Modal show={warnModal} endApi={`/product/${Id}`}
                handleClose={() => setwarnmodal(!warnModal)}
                refreshTable={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <Sec_Heading page="Product Management" subtitle="Products" />
            <Section>
                <div className="col-12">
                    <DataTable
                        pdfName='products'
                        addURL='/dashboard/add/product'
                        cols={columns}
                        data={data}
                        tablebody={tableBody}
                        tableHeader={tableHeader}
                    />
                </div>
            </Section>
        </>
    )
}

export default React.memo(Products)