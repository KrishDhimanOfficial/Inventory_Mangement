import { useEffect, useState } from 'react';
import { Button, Sec_Heading, Section, Loader, Static_Modal } from '../../../components/component';
import DataTable from "react-data-table-component"
import Warehouse_Modal from './WareHouse_Modal';
import DataService from '../../../hooks/DataService';
import { useFetchData } from '../../../hooks/hook'
import { useDispatch } from 'react-redux';
import { setSingleData } from '../../../controller/singleData'

interface Warehouse {
  _id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  zipcode: string;
}


const Warehouses = () => {
  const dispatch = useDispatch()
  const [showmodal, setmodal] = useState(false)
  const [warnModal, setwarnmodal] = useState(false)
  const [loading, setloading] = useState(false)
  const [data, setdata] = useState([])
  const [refreshTable, setrefreshTable] = useState(false)
  const [Id, setId] = useState('')
  const { fetchData: fetchSingleWarehouse } = useFetchData()


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
          <Button text='' onclick={() => handleTableRow(row._id)} className='btn btn-success me-2' icon={<i className="fa-solid fa-pen-to-square"></i>} />
          <Button text='' onclick={() => deleteTableRow(row._id)} className='btn btn-danger' icon={<i className="fa-solid fa-trash"></i>} />
        </div>
      )
    },
  ]
  const handleTableRow = async (id: string) => { fetchSingleWarehouse(`/warehouse/${id}`), setmodal(!showmodal) }
  const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

  const fetch = async () => {
    try {
      setloading(true)
      const res = await DataService.get('/warehouses')
      const response = res.map((warehouse: Warehouse, i: number) => ({
        id: i + 1, _id: warehouse._id, name: warehouse.name,
        address: warehouse.address, city: warehouse.city,
        country: warehouse.country, zipcode: warehouse.zipcode,
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
        handleClose={() => {
          setwarnmodal(!warnModal)
          setrefreshTable(!refreshTable)
          setloading(!loading)
        }} />
      <Warehouse_Modal
        show={showmodal}
        handleClose={() => {
          setmodal(!showmodal)
          dispatch(setSingleData({}))
          setrefreshTable(!refreshTable)
          setloading(!loading)
        }} />
      <Sec_Heading page='Warehouse Management' subtitle='settings' />
      <Section>
        <div className="col-12">
          <div className="card">
            <div className="card-body pt-1">
              <div className="row mt-2 mb-2">
                <div className="col-sm-6 offset-md-6">
                  <Button
                    text='Create'
                    className='btn btn-primary float-end'
                    onclick={() => setmodal(!showmodal)}
                  />
                </div>
              </div>
              <DataTable
                title="Warehouses"
                columns={columns}
                data={data}
                progressPending={loading}
                progressComponent={<Loader />}
                pagination
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

export default Warehouses