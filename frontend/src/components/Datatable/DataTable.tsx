import React, { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Link, useLocation } from 'react-router';
import { downloadCSV } from '../../hooks/datatable';
import { Button } from '../component';
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
interface Props {
    data: any[],
    cols: any[],
    tablebody: any[],
    tableHeader: any[],
    addURL?: string,
    pdfName: string,
    paymentModal?: () => void
    addbtn?: React.ReactNode
    rowCount?: number,
    paginationProps?: any,
    addPermission?: boolean,
    isloading: boolean,
}

const DataTable: React.FC<Props> = ({ addURL, data, cols, isloading, tablebody, tableHeader, pdfName, addPermission, paginationProps, rowCount, addbtn }) => {
    const { pagination, setPagination } = paginationProps;
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
        manualPagination: true,
        rowCount, // total rows from the server
        state: {
            pagination,
            isLoading: isloading,
            showSkeletons: isloading
        },
        onPaginationChange: setPagination,
        muiTableBodyCellProps: {
            sx: {
                overflow: "visible",
                position: "relative",
                zIndex: 999,
            },
        },
        enableColumnFilterModes: true,
        renderTopToolbarCustomActions: ({ table }) => (
            <div className='d-flex gap-2'>
                <Button text='Download PDF'
                    onclick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
                    className='btn btn-dark btn-sm bg-transparent text-dark h-fit' icon={<i className="fa-solid fa-print me-2"></i>}
                />
                <Button text='Download CSV'
                    onclick={() => downloadCSV(pdfName, data)}
                    className='btn btn-dark btn-sm bg-transparent text-dark h-fit' icon={<i className="fa-solid fa-print me-2"></i>}
                />
                {
                    (addPermission && addURL) && (
                        <Link to={addURL} state={{ from: location.pathname }} className='btn btn-dark btn-sm bg-transparent text-dark h-fit'> Add</Link>
                    )
                }
                {
                    addbtn && (addbtn)
                }
            </div>
        )
    })
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MaterialReactTable table={table} />
        </LocalizationProvider>
    )
}

export default React.memo(DataTable)