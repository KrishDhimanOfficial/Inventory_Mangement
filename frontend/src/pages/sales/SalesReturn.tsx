import React from 'react';
import { Section, Sec_Heading, Loader, Button, Static_Modal, DropDownMenu } from '../../components/component'
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook'
import DataTable from 'react-data-table-component'

const SalesReturn = () => {
    return (
        <>
            <Sec_Heading page={"All Sales Return"} subtitle="Sales Return" />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )
}
export default SalesReturn