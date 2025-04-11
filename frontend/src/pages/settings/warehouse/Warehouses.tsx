import { lazy, useEffect, useState } from 'react';
import { Button, Sec_Heading, Section, Loader, Static_Modal } from '../../../components/component';
import DataTable from "react-data-table-component"
import DataService from '../../../hooks/DataService';
import { useFetchData, downloadCSV, generatePDF } from '../../../hooks/hook'
const Warehouse_Modal = lazy(() => import('./WareHouse_Modal'))

interface Warehouse { id: string, _id: string; name: string; address: string; city: string; country: string; zipcode: string; product_warehouseId: number; purchase_warehouseId: number; sales_warehouseId: number; }

const Warehouses = () => {
  const [showmodal, setmodal] = useState(false)
  const [warnModal, setwarnmodal] = useState(false)
  const [loading, setloading] = useState(false)
  const [data, setdata] = useState([])
  const [refreshTable, setrefreshTable] = useState(false)
  const [Id, setId] = useState('')
  const { fetchData: fetchSingleWarehouse } = useFetchData({ showmodal })


  const columns = [
    { name: "ID", selector: (row: any) => row.id, sortable: true },
    { name: "Name", selector: (row: any) => row.name, sortable: true },
    { name: "Address", selector: (row: any) => row.address, sortable: true },
    { name: "City", selector: (row: any) => row.city, sortable: true },
    { name: "Country", selector: (row: any) => row.country, sortable: true },
    { name: "Zipcode", selector: (row: any) => row.zipcode, sortable: true },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="d-flex justify-content-between">
          <Button text='' onclick={() => { handleTableRow(row._id) }} className='btn btn-success me-2' icon={<i className="fa-solid fa-pen-to-square"></i>} />
          {
            (row.product_warehouseId == 0 && row.sales_warehouseId == 0 && row.purchase_warehouseId == 0) && (
              <Button text='' onclick={() => { deleteTableRow(row._id) }} className='btn btn-danger' icon={<i className="fa-solid fa-trash"></i>} />
            )
          }
        </div>
      )
    },
  ]

  const pdfColumns = ["S.No", "Name", "Address", "City", "Country", "Zipcode"]
  const tableBody = data.map((warehouse: Warehouse) => [warehouse.id, warehouse.name, warehouse.address, warehouse.city, warehouse.country, warehouse.zipcode])
  const handleTableRow = (id: string) => { fetchSingleWarehouse(`/warehouse/${id}`), setmodal(!showmodal) }
  const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

  const fetch = async () => {
    try {
      setloading(true)
      const warehouseRes = await DataService.get('/check-warehouseId-isfound')
      const response = warehouseRes?.map((warehouse: Warehouse, i: number) => ({
        id: i + 1, _id: warehouse._id, name: warehouse.name,
        address: warehouse.address, city: warehouse.city,
        country: warehouse.country, zipcode: warehouse.zipcode,
        product_warehouseId: warehouse.product_warehouseId,
        sales_warehouseId: warehouse.sales_warehouseId,
        purchase_warehouseId: warehouse.purchase_warehouseId,
      }))
      setdata(response), setloading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => { fetch() }, [refreshTable])
  return (
    <>
      <title>Dashboard | Warehouse Management</title>
      <Static_Modal show={warnModal} endApi={`/warehouse/${Id}`}
        handleClose={() => setwarnmodal(!warnModal)}
        refreshTable={() => {
          setwarnmodal(!warnModal)
          setrefreshTable(!refreshTable)
          setloading(!loading)
        }} />
      <Warehouse_Modal show={showmodal}
        handleClose={() => { setmodal(!showmodal) }}
        refreshTable={() => {
          setrefreshTable(!refreshTable)
          setloading(!loading)
        }}
      />
      <Sec_Heading page='Warehouse Management' subtitle='settings' />
      <Section>
        <div className="col-12">
          <div className="card">
            <div className="card-body pt-1">
              <DataTable
                title="Warehouses"
                columns={columns}
                data={data}
                progressPending={loading}
                progressComponent={<Loader />}
                pagination
                subHeader
                subHeaderComponent={
                  <div className="d-flex gap-3 justify-content-end">
                    <Button
                      text='Generate PDF'
                      className='btn btn-danger'
                      onclick={() => generatePDF('warehouses', pdfColumns, tableBody)}
                    />
                    <Button
                      text='CSV'
                      className='btn btn-success'
                      onclick={() => downloadCSV('warehouses', data)}
                    />
                    <Button
                      text='Create'
                      className='btn btn-primary'
                      onclick={() => setmodal(!showmodal)}
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

export default Warehouses