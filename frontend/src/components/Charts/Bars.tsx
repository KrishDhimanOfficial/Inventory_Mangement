import React, { useEffect, useState } from 'react';
import { VictoryChart, VictoryBar, VictoryGroup, VictoryLegend, VictoryTheme } from 'victory'
import { DataService } from '../../hooks/hook'


const Bars = () => {
    const [sales, setSales] = useState<any>([])
    const [purchases, setpurchases] = useState<any>([])
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
            setSales(res.sales?.map((item: any) => ({
                x: item._id,
                y: item.totalSales,
            })).slice(0, 7))
            setpurchases(res.purchase?.map((item: any) => ({
                x: item._id,
                y: item.totalPurchase,
            })).slice(0, 7))
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [])
    return (
        <div className="card">
            <div className="card-header bg-info">
                <h3 className='card-title mb-0'>Purchase & Sales</h3>
            </div>
            <div className="card-body">
                <VictoryChart
                    theme={VictoryTheme.clean}
                    domain={{ y: [1, 10] }}
                    domainPadding={{ x: 40 }} >
                    <VictoryLegend
                        x={90}
                        y={20}
                        orientation="horizontal"
                        gutter={20}
                        data={[
                            { name: "Sales" },
                            { name: "Purchases" },
                        ]}
                    />
                    <VictoryGroup
                        offset={40}
                        style={{ data: { width: 15 } }}>
                        <VictoryBar
                            data={sales}
                            labels={({ datum }) => datum.y}
                        />
                        <VictoryBar
                            data={purchases}
                            style={{
                                labels: {
                                    fontSize: 1, // adjust the font size here
                                },
                                parent: {
                                    fontSize: 1, // adjust the font size here
                                },
                            }}
                            labels={({ datum }) => (datum.y, datum.x.toString())}
                        />
                    </VictoryGroup>
                </VictoryChart>
            </div>
        </div>
    )
}

export default React.memo(Bars)