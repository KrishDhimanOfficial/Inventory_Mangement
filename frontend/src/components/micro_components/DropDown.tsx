import React, { useState } from 'react';
import { Link, useLocation, } from 'react-router-dom';
import Button from './Button';
import { DataService, } from '../../hooks/hook';
import { useDispatch, } from 'react-redux';
import { setSingleData } from '../../controller/singleData'
import { Menu, IconButton, } from '@mui/material'

interface Props {
    api?: string,
    name?: string,
    editURL?: string,
    returnURL?: string,
    detailsURL?: string,
    deletedata?: () => void,
    paymentModal?: () => void,
    updatepermission?: Boolean,
    deletepermission?: Boolean,
    return_status?: Boolean,
    isReturnItem?: Boolean,
    paymentbtnShow?: any,
}

const DropDownMenu: React.FC<Props> = ({ name, api, editURL, detailsURL, deletedata, updatepermission, paymentbtnShow, deletepermission, isReturnItem, return_status, paymentModal, returnURL }) => {
    const dispatch = useDispatch()
    const location = useLocation()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const handlePaymentModalOpen = async () => {
        try {
            const res = await DataService.get(`${api}`)
            paymentModal && paymentModal()
            dispatch(setSingleData(res))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <IconButton onClick={handleClick}>
                <i className="fa-solid fa-ellipsis-vertical"></i>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                disablePortal={false}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {
                    [
                        updatepermission && ( // check permssion to perform Put Operation
                            !return_status && (
                                <Link to={`${editURL}`} key={0} state={{ from: location.pathname }} className='px-3 py-1 text-decoration-none text-dark w-100 d-inline-block'> Edit </Link>
                            )
                        ),
                        updatepermission && ( // check permssion to perform Put Operation
                            (paymentbtnShow === 'unpaid' || paymentbtnShow === 'parital') && (
                                <Button key={1}
                                    type='button'
                                    className='px-3 py-1 d-inline-block w-100 bg-transparent border-0 text-start'
                                    text='Create Payment'
                                    onclick={() => { handlePaymentModalOpen(), handleClose() }}
                                />
                            )
                        ),

                        (paymentbtnShow === 'paid' && !isReturnItem) && (
                            <Link to={`${returnURL}`} key={2} state={{ from: location.pathname }} className='px-3 py-1 text-decoration-none text-dark w-100 d-inline-block'>{name} Return </Link>
                        ),

                        <Link to={`${detailsURL}`} key={3} state={{ from: location.pathname }} className='px-3 py-1 text-decoration-none text-dark w-100 d-inline-block'>{name} Details </Link>,

                        deletepermission && ( // check permssion to perform Delete Operation
                            !return_status && ( // Check return status to prevent to delete
                                <Button
                                    key={4}
                                    type='button'
                                    className='px-3 py-1 d-inline-block w-100 bg-transparent border-0 text-start'
                                    text='Delete'
                                    onclick={() => { deletedata && deletedata(), handleClose() }}
                                />
                            )
                        )
                    ]
                }
            </Menu>
        </>
    )
}
export default React.memo(DropDownMenu)