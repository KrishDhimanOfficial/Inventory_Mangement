import React, { useEffect, useState } from 'react';
import { VictoryChart, VictoryBar, VictoryGroup, VictoryAxis, VictoryLabel, VictoryLegend, VictoryTheme } from 'victory'
import { DataService } from '../../hooks/hook'
import { DateRangePicker } from 'react-date-range'
import { DropdownButton, Dropdown, } from 'react-bootstrap';

const Bars = () => {
    const [sales, setSales] = useState<any>([])
    const [purchases, setpurchases] = useState<any>([])
    const [y_axis, sety_axis] = useState<number>(10)
    const [state, setState] = useState([
        {
            startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
            endDate: new Date(),
            key: 'selection'
        }
    ])

    const fetch = async () => {
        try {
            const res = await DataService.get(`/get/sales-purchase-by-day?startDate=${state[0].startDate}&endDate=${state[0].endDate}`)
            sety_axis(res?.reduce((acc: any, item: any) => {
                const total = item.totalSales + item.totalPurchase
                return Math.max(acc, total)
            }, 0) + 10)
            setSales(
                res
                    ?.filter((item: any) => item._id?.sDate)
                    .map((item: any) => ({
                        x: item.selling_date,
                        y: item.totalSales,
                    }))
            )
            setpurchases(
                res
                    ?.filter((item: any) => item._id?.pDate)
                    .map((item: any) => ({
                        x: item.purchase_date,
                        y: item.totalPurchase,
                    }))
            )
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [state, setState])
    return (
        <div className="card">
            <div className="card-header bg-info d-flex justify-content-between align-items-center w-100">
                <h3 className='card-title mb-0'>Purchase & Sales</h3>
                <DropdownButton id="dropdown-basic-button"
                    title={`${state[0].startDate.toLocaleDateString()} - ${state[0].endDate.toLocaleDateString()}`}
                    className='ms-auto border-1 border-black'
                    variant='white'>
                    <Dropdown.Item href="#" className='p-0'>
                        <DateRangePicker
                            editableDateInputs={true}
                            onChange={(item: any) => setState([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={state}
                        />
                    </Dropdown.Item>
                </DropdownButton>
            </div>

            <div className="card-body">
                <VictoryChart
                    theme={VictoryTheme.clean}
                    domain={{ y: [1, y_axis] }}
                    domainPadding={{ x: 20 }}
                >
                    <VictoryLegend
                        x={90}
                        y={20}
                        orientation="horizontal"
                        animate={{ duration: 200 }}
                        gutter={20}
                        data={[
                            { name: "Sales" },
                            { name: "Purchases" },
                        ]}
                    />

                    <VictoryAxis
                        tickLabelComponent={<VictoryLabel angle={-40} textAnchor="end" />}
                    />

                    <VictoryAxis dependentAxis />

                    <VictoryGroup offset={20} style={{ data: { width: 15 } }}>
                        <VictoryBar
                            data={sales}
                            labels={({ datum }) => Math.trunc(datum.y)}
                            animate={{ duration: 1000 }}
                        />
                        <VictoryBar
                            data={purchases}
                            labels={({ datum }) => Math.trunc(datum.y)}
                            animate={{ duration: 1000 }}
                        />
                    </VictoryGroup>
                </VictoryChart>

            </div>
        </div>
    )
}

export default React.memo(Bars)