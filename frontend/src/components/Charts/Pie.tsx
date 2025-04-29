import React, { useEffect, useState } from 'react'
import { VictoryPie, VictoryTheme } from 'victory'
import { DataService } from '../../hooks/hook'

const Pie = () => {
    const [data, setdata] = useState([])
    const [state, setState] = useState([
        {
            startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
            endDate: new Date(),
            key: 'selection'
        }
    ])

    const fetch = async () => {
        try {
            const res = await DataService.get(`/get/top-selling-products/chart?startDate=${state[0].startDate}&endDate=${state[0].endDate}`)
            const data = res?.map((item: any) => ({
                x: item._id?.product,
                y: item.tsales,
            })).slice(0, 5)
            setdata(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [])
    return (
        <div className="card">
            <div className="card-header bg-danger">
                <h3 className='card-title mb-0'>Top Selling Products</h3>
            </div>
            <div className="card-body">
                <VictoryPie
                    width={400}
                    data={data}
                    style={{
                        labels: {
                            fontSize: 12, // adjust the font size here
                            fontFamily: 'Arial', // optional
                        },
                        parent: {
                            fontSize: 12, // adjust the font size here
                            fontFamily: 'Arial', // optional
                        },
                    }}
                    animate={{ duration: 500 }}
                    theme={VictoryTheme.clean}
                />
            </div>
        </div>
    )
}

export default React.memo(Pie)