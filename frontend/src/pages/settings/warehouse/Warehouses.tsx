import { lazy, useEffect, useState } from 'react';
import { Button, Sec_Heading, Section, Static_Modal, DataTable } from '../../../components/component';
import DataService from '../../../hooks/DataService';
import { useFetchData} from '../../../hooks/hook'
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
  const [rowCount, setRowCount] = useState(0)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })


  const columns = [
    { header: "Name", accessorKey: 'name' },
    { header: "Zipcode", accessorKey: 'zipcode' },
    { header: "City", accessorKey: 'city' },
    { header: "Country", accessorKey: 'country' },
    { header: "Address", accessorKey: 'address' },
    {
      header: "Actions",
      enableColumnFilter: false,
      enableSorting: false,
      accessorFn: (row: any) => (
        <div className="d-flex justify-content-between">
          <Button text='' onclick={() => { handleTableRow(row._id) }}   className='btn btn-dark btn-sm bg-transparent text-dark h-fit me-2' icon={<i className="fa-solid fa-pen-to-square"></i>} />
          {
            (row.product_warehouseId == 0 && row.sales_warehouseId == 0 && row.purchase_warehouseId == 0) && (
              <Button text='' onclick={() => { deleteTableRow(row._id) }}  className='btn btn-dark btn-sm bg-transparent text-dark h-fit' icon={<i className="fa-solid fa-trash"></i>} />
            )
          }
        </div>
      )
    },
  ]


  const tableHeader = ["Name", "Address", "City", "Country", "Zipcode"]
  const tableBody = data.map((warehouse: Warehouse) => [warehouse.name, warehouse.address, warehouse.city, warehouse.country, warehouse.zipcode])
  const handleTableRow = (id: string) => { fetchSingleWarehouse(`/warehouse/${id}`), setmodal(!showmodal) }
  const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

  const fetch = async () => {
    try {
      setloading(true)
      const warehouseRes = await DataService.get(`/check-warehouseId-isfound?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`)
      const response = warehouseRes.collectionData?.map((warehouse: Warehouse) => ({
        _id: warehouse._id, name: warehouse.name,
        address: warehouse.address, city: warehouse.city,
        country: warehouse.country, zipcode: warehouse.zipcode,
        product_warehouseId: warehouse.product_warehouseId,
        sales_warehouseId: warehouse.sales_warehouseId,
        purchase_warehouseId: warehouse.purchase_warehouseId,
      }))
      setRowCount(response.totalDocs), setdata(response), setloading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => { fetch() }, [!refreshTable,pagination.pageIndex])
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
      <Sec_Heading page='Warehouse Management' subtitle='warehouses' />
      <Section>
        <div className="col-12">
          <DataTable
            pdfName='warehouses'
            cols={columns}
            data={data}
            tablebody={tableBody}
            tableHeader={tableHeader}
            rowCount={rowCount}
            paginationProps={{ pagination, setPagination }}
            isloading={loading}
            addbtn={
              <Button
                text='Add'
                className='btn btn-dark btn-sm bg-transparent text-dark h-fit'
                onclick={() => setmodal(!showmodal)}
              />
            }
          />
        </div>
      </Section>
    </>
  )
}

export default Warehouses