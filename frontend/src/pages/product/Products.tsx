import { useEffect, useState } from 'react'
import { Sec_Heading, Section, Button, Loader, Static_Modal, Image } from '../../components/component'
import { DataService, downloadCSV, generatePDF } from '../../hooks/hook'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router'
interface ProductSchema {
    id: number,
    name: string,
    update: string,
    _id: string
    title: string,
    image: string,
    sku: string,
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

const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
]

const Products = () => {
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [warnModal, setwarnmodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [Id, setId] = useState('')

    const columns = [
        { name: "ID", selector: (row: any) => row.id, sortable: true },
        { name: "Product", selector: (row: any) => row.product, sortable: true },
        { name: "Name", selector: (row: any) => row.name, sortable: true },
        { name: "Brand", selector: (row: any) => row.brand, sortable: true },
        { name: "Code", selector: (row: any) => row.code, sortable: true },
        { name: "Category", selector: (row: any) => row.category, sortable: true },
        { name: "Cost", selector: (row: any) => row.cost, sortable: true },
        { name: "Price", selector: (row: any) => row.price, sortable: true },
        { name: "Unit", selector: (row: any) => row.unit, sortable: true },
        { name: "Last update", selector: (row: any) => row.update, sortable: true },
        {
            name: "Actions",
            cell: (row: any) => (
                <div className="d-flex justify-content-between">
                    <Link to={`/dashboard/product/${row._id}`} className='btn btn-success me-2'>
                        <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                    <Button text=''
                        onclick={() => deleteTableRow(row._id)}
                        className='btn btn-danger' icon={<i className="fa-solid fa-trash"></i>} />
                </div>
            )
        },
    ]
    const tableBody = data.map((product: ProductSchema) => [
        product.id,
        product.name,
        product.sku,
        product.cost,
        product.price,
        `${product.tax} %`,
        product.category,
        product.brand,
        product.unit,
        product.update,
    ])
    const pdfColumns = ["S.No", "Title", "SKU", "Cost", "Price", "Tax", "Category", "Brand", "Unit", "Date"]
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }
    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get('/all/products')
            const response = res.map((pro: ProductSchema, i: number) => ({
                id: i + 1, _id: pro._id,
                product: <Image path={pro.image} className='w-100 h-100' />,
                sku: pro.sku,
                tax: pro.tax,
                name: pro.title,
                brand: pro.brand?.name,
                code: pro.sku,
                category: pro.category?.name,
                cost: pro.cost,
                price: pro.price,
                unit: pro.unit?.shortName,
                update: `${pro.day} ${months[parseInt(pro.month)]},${pro.year}`,
            }))
            setdata(response), setloading(false)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => { fetch() }, [])
    return (
        <>
            <Static_Modal show={warnModal} endApi={`/product/${Id}`}
                handleClose={() => { setwarnmodal(!warnModal) }}
                refreshTable={() => {
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <Sec_Heading page="Product Management" subtitle="Products" />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Products Details"
                                columns={columns}
                                data={data || []}
                                progressPending={loading}
                                progressComponent={<Loader />}
                                pagination
                                subHeader
                                subHeaderComponent={
                                    <div className="d-flex gap-3 justify-content-end">
                                        <Button
                                            text='Generate PDF'
                                            className='btn btn-danger'
                                            onclick={() => generatePDF('product.pdf', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success'
                                            onclick={() => downloadCSV('products', data)}
                                        />
                                        <Link className='btn btn-primary' to='/dashboard/add/product'>
                                            Create
                                        </Link>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )
}

export default Products