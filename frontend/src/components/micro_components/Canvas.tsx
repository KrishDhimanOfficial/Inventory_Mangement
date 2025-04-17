import React, { useCallback, useEffect, useState } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { Input } from '../component'
import Select from 'react-select'
import DataService from '../../hooks/DataService';
import config from '../../config/config';
interface Canvas {
    name: string;
    data: any;
    show: boolean;
    selectBoxApi1: string;
    selectBoxApi2: string;
    handleClose: () => void;
    setData: any;
}

const status = [{ label: 'paid', value: 'paid' }, { label: 'parital', value: 'parital' }, { label: 'unpaid', value: 'unpaid' }]

const Canvas: React.FC<Canvas> = ({ name, data, show, handleClose, selectBoxApi1, selectBoxApi2, setData }) => {
    const [select1, setselect1] = useState([{ label: '', value: '' }])
    const [select2, setselect2] = useState([{ label: '', value: '' }])
    const [selectedoption1, setselectedoption1] = useState({ label: `Select ${name}`, value: '' })
    const [selectedoption2, setselectedoption2] = useState({ label: 'Select Warehouse', value: '' })
    const [selectedStatus, setStatus] = useState({ label: 'Select Payment Status', value: '' })
    const [ref, setref] = useState('')

    const fetch = async () => {
        try {
            const [res1, res2] = await Promise.all([
                DataService.get(selectBoxApi1, {
                    Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
                }),
                DataService.get(selectBoxApi2, {
                    Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
                }),
            ])
            setselect1(res1?.map((item: any) => ({ value: item.name, label: item.name })))
            setselect2(res2?.map((item: any) => ({ value: item.name, label: item.name })))
        } catch (error) {
            console.error(error)
        }
    }

    const handleFiltering = () => {
        const filterdata = data.filter((item: any) => {
            return item.supplier
                ? item.supplier && item.supplier.toLowerCase().includes(selectedoption1.value.toLowerCase())
                : item.customer && item.customer.toLowerCase().includes(selectedoption1.value.toLowerCase())
                &&
                item.warehouse && item.warehouse.toLowerCase().includes(selectedoption2.value.toLowerCase()) &&
                item.pstatus.props?.text && item.pstatus.props?.text.toLowerCase().includes(selectedStatus.value.toLowerCase()) &&
                item.reference && item.reference.toLowerCase().includes(ref.toLowerCase())
        })
        setData(filterdata)
        handleClose()
    }

    const reset = () => {
        setref(''), setStatus({ label: `Select Payment Status`, value: '' })
        setselectedoption1({ label: `Select ${name}`, value: '' })
        setselectedoption2({ label: 'Warehouse', value: '' })
    }

    useEffect(() => { fetch() }, [])
    return (
        <Offcanvas show={show} onHide={handleClose} placement='end'>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Filters</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <form onSubmit={(e) => { e.preventDefault(), handleFiltering() }}>
                    <div className={`inputForm mb-2`}>
                        <Input
                            type="text"
                            className="input"
                            placeholder="Reference"
                            onChange={(e: any) => setref(e.target.value.trim())}
                        />
                    </div>
                    <div className={`inputForm mb-2`}>
                        <Select
                            isClearable
                            isSearchable
                            className='select'
                            isRtl={false}
                            placeholder='Select'
                            options={select1}
                            value={selectedoption1}
                            onChange={(selectedoption: any) => setselectedoption1(selectedoption)}
                            styles={{ control: (style: any) => ({ ...style, boxShadow: 'none', border: 'none', }) }}
                        />
                    </div>
                    <div className={`inputForm mb-2`}>
                        <Select
                            isClearable
                            isSearchable
                            className='select'
                            isRtl={false}
                            placeholder='Select'
                            options={select2}
                            value={selectedoption2}
                            onChange={(selectedoption: any) => setselectedoption2(selectedoption)}
                            styles={{ control: (style: any) => ({ ...style, boxShadow: 'none', border: 'none', }) }}
                        />
                    </div>
                    <div className={`inputForm mb-2`}>
                        <Select
                            isClearable
                            isSearchable
                            className='select'
                            isRtl={false}
                            placeholder='Select Payment Status'
                            value={selectedStatus}
                            options={status}
                            onChange={(selectedoption: any) => setStatus(selectedoption)}
                            styles={{ control: (style: any) => ({ ...style, boxShadow: 'none', border: 'none', }) }}
                        />
                    </div>
                    <div className='d-flex gap-2'>
                        <button type='submit' className='btn btn-primary'>Filter</button>
                        <button type='button' onClick={() => reset()} className='btn btn-secondary'>Reset</button>
                    </div>
                </form>
            </Offcanvas.Body>
        </Offcanvas>
    )
}
export default React.memo(Canvas)