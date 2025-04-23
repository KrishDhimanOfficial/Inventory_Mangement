import React, { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Link, useLocation } from 'react-router';
import { Button } from '../component';
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
interface Props {
    data: any[],
    tablebody: any[],
    tableHeader: any[],
    addURL: string,
    deleteTableRow: any,
    pdfName: string
}

const DataTable: React.FC<Props> = ({ addURL, data, tablebody, tableHeader, deleteTableRow, pdfName }) => {
    const location = useLocation()
    const columns = useMemo<any>(
        () => [
            { accessorKey: 'id', header: 'ID', },
            { accessorKey: 'code', header: 'Code' },
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'category', header: 'Category' },
            { accessorKey: 'brand', header: 'Brand' },
        ],
        [],
    )

    const handleExportRows = (rows: any) => {
        const doc = new jsPDF()

        autoTable(doc, {
            head: [tableHeader],
            body: tablebody,
        });

        doc.save(`${pdfName}.pdf`)
    }

    const table = useMaterialReactTable({
        columns,
        data,
        columnFilterDisplayMode: 'popover',
        enableRowActions: true,
        renderRowActionMenuItems: ({ row }: { row: any }) => [
            <div className="d-flex flex-column gap-2 p-2 justify-content-between" key={row.id}>
                <Link to={`/dashboard/product/${row.original?._id}`} className='btn btn-success'>
                    <i className="fa-solid fa-pen-to-square"></i>
                </Link>

                <Button text=''
                    onclick={() => { deleteTableRow(row.original?._id) }}
                    className='btn btn-danger' icon={<i className="fa-solid fa-trash"></i>}
                />
                <Button text=''
                    // onclick={() => printBarcode(row.code)}
                    className='btn btn-info text-white' icon={<i className="fa-solid fa-print"></i>}
                />
            </div>
        ],
        renderTopToolbarCustomActions: ({ table }) => (
            <div className='d-flex gap-2'>
                <Button text='Download PDF'
                    onclick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
                    className='btn btn-dark btn-sm bg-transparent text-dark h-fit' icon={<i className="fa-solid fa-print"></i>}
                />
                <Link to={addURL} state={{ from: location.pathname }} className='btn btn-dark btn-sm bg-transparent text-dark h-fit'>Add</Link>
            </div>
        )
    })

    return <MaterialReactTable table={table} />
}

export default DataTable