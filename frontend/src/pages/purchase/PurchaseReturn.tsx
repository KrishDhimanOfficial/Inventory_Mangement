import React from 'react';
import { Section, Sec_Heading, Loader, Button, Static_Modal, DropDownMenu } from '../../components/component'
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook'
import DataTable from 'react-data-table-component'

const PurchaseReturn = () => {
    const columns = [
        { name: "Date", selector: (row: any) => row.date, sortable: true },
        { name: "Reference", selector: (row: any) => row.reference, sortable: true },
        { name: "Supplier", selector: (row: any) => row.supplier, sortable: true },
        { name: "Warehouse", selector: (row: any) => row.warehouse, sortable: true },
        { name: "Purchase Ref", selector: (row: any) => row.purchaseref, sortable: true },
        { name: "Grand Total", selector: (row: any) => row.total, sortable: true },
        { name: "Paid", selector: (row: any) => row.paid, sortable: true },
        { name: "Due", selector: (row: any) => row.due, sortable: true },
        { name: "Payment Status", selector: (row: any) => row.pstatus, sortable: true },
        {
            name: "Actions",
            cell: (row: any) => (
                <></>
                // <DropDownMenu
                //     api={`/purchase/${row.reference}`}
                //     editURL={`/dashboard/purchase/${row.reference}`}
                //     deletedata={() => deleteTableRow(row.id)}
                //     detailsURL={`/dashboard/purchase-Details/${row.reference}`}
                //     updatepermission={permission.purchase?.edit}
                //     deletepermission={permission.purchase?.delete}
                //     paymentbtnShow={row.pstatus}
                //     paymentModal={() => setpaymentodal(!paymentodal)}
                // />
            )
        },
    ]
    return (
        <>
            <Sec_Heading page={"All Purchase Return"} subtitle="Purchase Return" />
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

export default PurchaseReturn