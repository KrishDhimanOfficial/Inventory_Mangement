import { useEffect, useState } from 'react';
import { Sec_Heading, Section, Button, Loader } from '../../components/component';
import DataTable from 'react-data-table-component';
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook';
import config from '../../config/config';
import Select from 'react-select';

const StockReport = () => {
    const [loading, setloading] = useState(false);
    const [data, setdata] = useState([]);
    const [warehouses, setwarehouses] = useState([])
    const [warehouseOption, setwarehouseOption] = useState({ value: '', label: 'Select Warehouse' })

    const columns = [
        { name: "Reference", selector: (row: any) => row.ref, sortable: true },
        { name: "Product", selector: (row: any) => row.product, sortable: true },
        { name: "Category", selector: (row: any) => row.category, sortable: true },
        { name: "Stock", selector: (row: any) => row.stock, sortable: true },
    ];


    const tableBody = data.map((product: any, i: number) => [
        i + 1,
        product.ref,
        product.product,
        product.category,
        product.stock,
    ])

    const pdfColumns = ["S.No", "Reference", "Product", "Category", "Stock"];

    const getReport = async () => {
        try {
            setloading(true);
            const res = await DataService.get(`/get/product-stock/reports?warehouseId=${warehouseOption?.value}`);
            const data = res?.map((product: any) => ({
                ref: product.sku,
                product: product.title,
                category: product.category?.name,
                stock: product.stock,
            }))
            setloading(false);
            setdata(data);
        } catch (error) {
            console.error(error);
        } finally {
            setloading(false);
        }
    }

    const fetchwarehouses = async () => {
        try {
            const res = await DataService.get('/warehouses', {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`,
            })
            setwarehouses(res?.map((warehouse: any) => ({ value: warehouse._id, label: warehouse.name })))
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetchwarehouses() }, [])
    useEffect(() => { getReport() }, [warehouseOption?.value])
    return (
        <>
            <Sec_Heading page={"Product Stock Report"} subtitle="Report" />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Product Stock Reports"
                                columns={columns}
                                data={data}
                                progressPending={loading}
                                progressComponent={<Loader />}
                                pagination
                                subHeader
                                subHeaderComponent={
                                    <div className="d-flex gap-3">
                                        <div className={`inputForm col-6`}>
                                            <Select
                                                isClearable
                                                isSearchable
                                                className='select'
                                                isRtl={false}
                                                placeholder='Select Warehouse'
                                                classNamePrefix='select'
                                                options={warehouses}
                                                value={warehouseOption}
                                                onChange={(selectedoption: any) => setwarehouseOption(selectedoption)}
                                                styles={{ control: (style: any) => ({ ...style, boxShadow: 'none', border: 'none', }) }}
                                            />
                                        </div>
                                        <Button
                                            text='Generate PDF'
                                            className='btn btn-danger w-25'
                                            onclick={() => generatePDF('StockReport', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success  w-25'
                                            onclick={() => downloadCSV('StockReport', data)}
                                        />
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
export default StockReport