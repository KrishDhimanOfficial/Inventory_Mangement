import React, { useEffect, useState, useRef } from 'react'
import { Sec_Heading, Section, Button, Static_Modal, } from '../../components/component'
import { DataService, } from '../../hooks/hook'
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
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const { permission } = useSelector((state: any) => state.permission)

    const columns = [
        { accessorKey: 'id', header: 'ID', },
        { accessorKey: 'code', header: 'Code' },
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'category', header: 'Category' },
        { accessorKey: 'brand', header: 'Brand' },
        {
            header: 'Actions',
            enableColumnFilter: false,
            enableSorting: false,
            accessorFn: (row: any) => (
                <div className="d-flex gap-2 p-2 justify-content-between">
                    {
                        permission.product?.edit && (
                            <Link to={`/dashboard/product/${row._id}`} state={{ from: location.pathname }} className='btn btn-dark btn-sm bg-transparent text-dark h-fit'>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </Link>
                        )
                    }
                    {
                        permission.product?.delete && (
                            <Button text=''
                                onclick={() => { deleteTableRow(row._id) }}
                                className='btn btn-dark btn-sm bg-transparent text-dark h-fit' icon={<i className="fa-solid fa-trash"></i>}
                            />
                        )
                    }
                    <Button text=''
                        onclick={() => handlePrint(row.code)}
                        className='btn btn-dark btn-sm bg-transparent text-dark h-fit' icon={<i className="fa-solid fa-print"></i>}
                    />

                </div>
            ),
        }
    ]
    const handlePrint = (value: string) => {
        const printWindow: any = window.open('', '_blank')
        JsBarcode(barcodeRef.current, value, {
            format: "CODE128",
            lineColor: "#000",
            width: 2,
            height: 100,
            displayValue: true,
        })

        printWindow.document.write(`
          <html>
            <head>
              <title>Print Barcode</title>
              <style>
                body { display: flex; align-items: center; justify-content: center; height: 100vh; }
              </style>
            </head>
            <body>
              <svg id="barcode">${barcodeRef.current.outerHTML}</svg>
              <script>
                setTimeout(() => { window.print(); window.close(); }, 500);
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
    }

    const tableBody = data.map((product: ProductSchema) => [product.id, product.code, product.name, product.category, product.brand,])
    const tableHeader = ["S.No", "SKU", "Title", "Category", "Brand"]
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/all/products?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`)
            const response = res.collectionData?.map((pro: ProductSchema) => ({
                id: res.pageCounter++,
                _id: pro._id,
                code: pro.sku,
                name: pro.title,
                brand: pro.brand?.name,
                category: pro.category?.name,
            }))
            setRowCount(res.totalDocs), setdata(response), setloading(false)
        } catch (error) {
            setloading(false)
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [!refreshTable, pagination.pageIndex])

    return (
        <>
            <svg ref={barcodeRef} className='d-none' />
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
                        rowCount={rowCount}
                        paginationProps={{ pagination, setPagination }}
                        addPermission={permission.product?.create}
                        isloading={loading}
                    />
                </div>
            </Section>
        </>
    )
}

export default React.memo(Products)