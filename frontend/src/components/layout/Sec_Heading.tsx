import React from 'react';
interface Props {
    page: string,
    subtitle?: string
}

const Sec_heading: React.FC<Props> = ({ page, subtitle }) => {
    return (
        <div className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1 className="m-0">{page}</h1>
                    </div>
                    <div className="col-12">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">{subtitle}</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Sec_heading)