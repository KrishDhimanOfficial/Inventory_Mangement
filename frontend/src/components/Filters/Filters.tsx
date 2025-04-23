import { Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import React, { useCallback, useEffect } from 'react';
import { Input } from '../component';
import { DataService } from '../../hooks/hook';
import config from '../../config/config';
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface Props {
    data: Array<any>,
    setdata: React.Dispatch<React.SetStateAction<any>>,
    selectBoxApi1?: string,
    selectBoxApi2?: string
}

const Filters: React.FC<Props> = ({ data, setdata, selectBoxApi1, selectBoxApi2 }) => {
    const [selectBox1, setselectBox1] = React.useState([{ label: '', value: '' }])
    const [selectBox2, setselectBox2] = React.useState([{ label: '', value: '' }])
    const [state, setState] = React.useState([
        {
            startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
            endDate: new Date(),
            key: 'selection'
        }
    ])

    const fetch = async () => {
        try {
            const [res1, res2] = await Promise.all([
                DataService.get(selectBoxApi1 || '', {
                    Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
                }),
                DataService.get(selectBoxApi2 || '', {
                    Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
                }),
            ])
            setselectBox1(res1?.map((item: any) => ({ value: item.name, label: item.name })))
            setselectBox2(res2?.map((item: any) => ({ value: item.name, label: item.name })))
        } catch (error) {
            console.error(error)
        }
    }

    const handleFiltering = useCallback((searchedterm?: any) => {
        const filterdata = data.filter((item: any) => {
            return (
                // purchase & sales filtering
                item.supplier
                    ? item.supplier && item.supplier.toLowerCase().includes(searchedterm.toLowerCase())
                    : item.customer && item.customer.toLowerCase().includes(searchedterm.toLowerCase())) ||
                item.warehouse && item.warehouse.toLowerCase().includes(searchedterm.toLowerCase()) ||
                item.pstatus?.props.text && item.pstatus?.props.text.toLowerCase().includes(searchedterm.toLowerCase()) ||
                item.reference && item.reference.toLowerCase().includes(searchedterm.toLowerCase()) ||
                item.date && item.date.toLowerCase().includes(searchedterm.toLowerCase()) ||
                // product filtering
                item.code && item.code.toLowerCase().includes(searchedterm.toLowerCase()) ||
                item.name && item.name.toLowerCase().includes(searchedterm.toLowerCase()) ||
                item.brand && item.brand.toLowerCase().includes(searchedterm.toLowerCase()) ||
                item.category && item.category.toLowerCase().includes(searchedterm.toLowerCase())
        })
        setdata(filterdata)
    }, [data.length, state, setState])

    useEffect(() => { if (selectBoxApi1 && selectBoxApi2) fetch() }, [])
    return (
        <Row>
            <Col className='align-content-center'>
                <div className="searchbar">
                    <div className="searchbar-wrapper">
                        <div className="searchbar-center">
                            <div className="searchbar-input-spacer" />
                            <Input
                                type="text"
                                className="searchbar-input"
                                autoCapitalize="off"
                                onChange={(e: any) => handleFiltering(e.target.value.trim())}
                                title="Search" role="combobox" placeholder="Search this table" />
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default React.memo(Filters)