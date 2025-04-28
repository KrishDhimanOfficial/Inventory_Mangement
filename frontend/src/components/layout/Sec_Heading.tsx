import React, { useEffect, useState } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { useLocation, useNavigate } from 'react-router';
interface Props {
    page: string,
    subtitle?: string,
    ispural?: boolean
}

const Sec_heading: React.FC<Props> = ({ page, subtitle, ispural }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [lastBreadcrumb, setBreadcrumb] = useState(false)
    const previousPath = location.state?.from || '';

    useEffect(() => { if (!ispural) setBreadcrumb(true) }, [])
    return (
        <div className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1 className="m-0">{page}</h1>
                    </div>
                    <div className="col-12">
                        <Breadcrumb>
                            <Breadcrumb.Item onClick={(e) => { e.preventDefault(), navigate('/dashboard') }}>Dashboard</Breadcrumb.Item>
                            <Breadcrumb.Item onClick={(e) => { e.preventDefault(); navigate(previousPath); }} active={lastBreadcrumb} >
                                {ispural ? `${subtitle}s` : subtitle}
                            </Breadcrumb.Item>
                            {
                                previousPath !== '' && (
                                    <Breadcrumb.Item active>{subtitle}</Breadcrumb.Item>
                                )
                            }
                        </Breadcrumb>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Sec_heading)