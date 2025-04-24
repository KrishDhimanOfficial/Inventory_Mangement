import React, { useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Link, useLocation } from 'react-router';
import { Button } from '../component';
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
import { DropDownMenu } from '../component';
import { useDispatch } from 'react-redux';
import { DataService } from '../../hooks/hook';
import { setSingleData } from '../../controller/singleData'

interface Props {
    data: any[],
    cols: any[],
    tablebody: any[],
    tableHeader: any[],
    addURL: string,
    pdfName: string,
    actionMenuComponent?: React.ReactNode,
    updatepermission?: Boolean,
    deletepermission?: Boolean,
    paymentModal?: () => void
}

const DataTable: React.FC<Props> = ({ addURL, data, cols, tablebody, tableHeader, pdfName, updatepermission, deletepermission }) => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, // fetch 10 rows per page
    })
    const location = useLocation()
    const columns = useMemo<any>(() => cols, [])
    const handleExportRows = (rows: any) => {
        const doc = new jsPDF()

        autoTable(doc, {
            head: [tableHeader],
            body: tablebody,
        })

        doc.save(`${pdfName}.pdf`)
    }

    const table = useMaterialReactTable({
        columns,
        data,
        columnFilterDisplayMode: 'popover',
        enableRowActions: true,
        manualPagination: true,
        rowCount: 10, // total rows from the server
        state: { pagination },
        onPaginationChange: setPagination,
        renderRowActionMenuItems: ({ row }) => [
            <></>
        ],
        renderTopToolbarCustomActions: ({ table }) => (
            <div className='d-flex gap-2'>
                <Button text='Download PDF'
                    onclick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
                    className='btn btn-dark btn-sm bg-transparent text-dark h-fit' icon={<i className="fa-solid fa-print"></i>}
                />
                <Link to={addURL} state={{ from: location.pathname }} className='btn btn-dark btn-sm bg-transparent text-dark h-fit'> Add</Link>
            </div>
        )
    })
    return <MaterialReactTable table={table} />
}

export default DataTable