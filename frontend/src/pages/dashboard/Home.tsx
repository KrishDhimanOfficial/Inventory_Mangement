import React from 'react';
import { Section, Sec_Heading } from '../../components/component';

const Home = () => {
    return (
        <>
            <Sec_Heading page='Dashboard' />
            <Section>
                <div className="row">
                    <div className="col-md-3 col-sm-6 col-12">
                        <div className="info-box shadow-sm">
                            <span className="info-box-icon bg-info"><i className="fa-solid fa-arrow-up-right-dots"></i> </span>
                            <div className="info-box-content">
                                <span className="info-box-text">Sales</span>
                                <span className="info-box-number m-0">$ 20</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                        <div className="info-box shadow-sm">
                            <span className="info-box-icon bg-success"><i className="fa-solid fa-cart-shopping"></i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">Purchase</span>
                                <span className="info-box-number">$ 40</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                        <div className="info-box shadow-sm">
                            <span className="info-box-icon bg-warning"><i className="fa-solid fa-rotate-left"></i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">Sales Return</span>
                                <span className="info-box-number">$ 0</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                        <div className="info-box shadow-sm">
                            <span className="info-box-icon bg-danger"><i className="fa-solid fa-arrow-right-arrow-left"></i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">Purchase Return</span>
                                <span className="info-box-number">$ 0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )
}
export default Home