import { useEffect, useState } from 'react';
import { Section, Sec_Heading, Pie, Bars, RecentSales } from '../../components/component';
import { DataService } from '../../hooks/hook';
import { useSelector } from 'react-redux';

const Home = () => {
    const { settings } = useSelector((state: any) => state.singleData)
    const [details, setdetails] = useState<any>({})

    const fetch = async () => {
        try {
            const [res1] = await Promise.all([
                DataService.get('/get/dashbaord/reports')
            ])
            setdetails(res1)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => { fetch() }, [])
    return (
        <>
            <Section>
                <div className="row mt-5">
                    <div className="col-md-3 col-sm-6 col-12">
                        <div className="info-box shadow-sm">
                            <span className="info-box-icon bg-info"><i className="fa-solid fa-arrow-up-right-dots"></i> </span>
                            <div className="info-box-content">
                                <span className="info-box-text">Sales</span>
                                <span className="info-box-number m-0">{settings.currency?.value} {parseFloat(details.sales?.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                        <div className="info-box shadow-sm">
                            <span className="info-box-icon bg-success"><i className="fa-solid fa-cart-shopping"></i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">Purchases</span>
                                <span className="info-box-number">{settings.currency?.value} {parseFloat(details.purchases?.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                        <div className="info-box shadow-sm">
                            <span className="info-box-icon bg-warning"><i className="fa-solid fa-rotate-left"></i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">Sales Return</span>
                                <span className="info-box-number">{settings.currency?.value} {parseFloat(details.salesreturn?.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                        <div className="info-box shadow-sm">
                            <span className="info-box-icon bg-danger"><i className="fa-solid fa-arrow-right-arrow-left"></i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">Purchase Return</span>
                                <span className="info-box-number">{settings.currency?.value} {parseFloat(details.purchasereturn?.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <Bars />
                    </div>
                    <div className="col-4">
                        <Pie />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <RecentSales />
                    </div>
                </div>
            </Section>
        </>
    )
}
export default Home