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
        { name: "ID", selector: (row: any) => row.id, sortable: true },
        { name: "Code", selector: (row: any) => row.code, sortable: true },
        { name: "Name", selector: (row: any) => row.name, sortable: true },
        { name: "Category", selector: (row: any) => row.category, sortable: true },
        { name: "Brand", selector: (row: any) => row.brand, sortable: true },
        {
            name: "Actions",
            cell: (row: any) => (
                <div className="d-flex justify-content-between">
                    {
                        permission.product?.edit && (
                            <Link to={`/dashboard/product/${row._id}`} className='btn btn-success me-2'>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </Link>
                        )
                    }
                    {
                        permission.product?.delete && (
                            <Button text=''
                                onclick={() => deleteTableRow(row._id)}
                                className='btn btn-danger me-2' icon={<i className="fa-solid fa-trash"></i>}
                            />
                        )
                    }
                    <Button text=''
                        onclick={() => printBarcode(row.code)}
                        className='btn btn-info text-white' icon={<i className="fa-solid fa-print"></i>}
                    />
                </div>
            )
        },
    ]

    const printBarcode = (code: string) => {
        JsBarcode(barcodeRef.current, code, { format: "CODE39" })
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
            <html>
              <head>
                <title>Print Barcode</title>
              </head>
              <body>
                 <svg id="barcode">${barcodeRef.current?.outerHTML}</svg>
                <script>
                  window.onload = function() {
                    window.print();
                  }
                </script>
              </body>
            </html>
          `);
            printWindow.close()
        }
    }

    const tableBody = data.map((product: ProductSchema) => [
        product.id,
        product.code,
        product.name,
        product.category,
        product.brand,
    ])
    const tableHeader = ["S.No", "SKU", "Title", "Category", "Brand"]
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    const fetch = useCallback(async () => {
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
    }, [])

    useEffect(() => { fetch() }, [!refreshTable])
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
                        data={data}
                        tablebody={tableBody}
                        tableHeader={tableHeader}
                        deleteTableRow={deleteTableRow}
                    />
                    {/* <DataTable
                                title="Products Details"
                                columns={columns}
                                data={filterdata.length == 0 ? data : filterdata}
                                progressPending={loading}
                                progressComponent={<Loader />}
                                pagination
                                persistTableHead
                                subHeader
                                subHeaderComponent={
                                    <div className="d-flex gap-3 justify-content-end">
                                        <Button
                                            text='Generate PDF'
                                            className='btn btn-dark btn-sm bg-transparent text-dark h-fit'
                                            onclick={() => generatePDF('product.pdf', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-dark btn-sm bg-transparent text-dark h-fit'
                                            onclick={() => downloadCSV('products', data)}
                                        />
                                        {
                                            permission.product?.create && (
                                                <Link className='btn btn-dark btn-sm bg-transparent text-dark h-fit' state={{ from: location.pathname }} to='/dashboard/add/product'>
                                                    Create
                                                </Link>
                                            )
                                        }
                                    </div>
                                }
                            /> */}
                </div>
            </Section>
        </>
    )
}

export default React.memo(Products)