import DropdownButton from 'react-bootstrap/DropdownButton'
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import Button from './Button';
import { DataService } from '../../hooks/hook';
import { useDispatch } from 'react-redux';
import { setSingleData } from '../../controller/singleData'
import { useState } from 'react';

const DropDownMenu = ({ name, api, editURL, detailsURL, deletedata, updatepermission, paymentbtnShow, deletepermission, paymentModal, returnURL }: {
    api: string,
    name: string,
    editURL: string,
    returnURL: string,
    detailsURL: string,
    deletedata: () => void,
    paymentModal: () => void,
    updatepermission: Boolean,
    deletepermission: Boolean,
    paymentbtnShow: any,
}) => {
    const dispatch = useDispatch()

    const handlePaymentModalOpen = async () => {
        try {
            const res = await DataService.get(api)
            paymentModal()
            dispatch(setSingleData(res))
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <DropdownButton
                key='start'
                id={`dropdown-button-drop-start`}
                drop='start'
                variant="white"
                flip
                title={<i className="fa-solid fa-ellipsis-vertical"></i>}>

                {
                    updatepermission && (
                        <>
                            <Link to={`${editURL}`} className='px-3 py-1 text-decoration-none text-dark w-100 d-inline-block'> Edit </Link>
                            {
                                (paymentbtnShow.props?.text === 'unpaid' || paymentbtnShow.props?.text === 'parital') && (
                                    <Button
                                        type='button'
                                        className='px-3 py-1 d-inline-block w-100 bg-transparent border-0 text-start'
                                        text='Create Payment'
                                        onclick={() => handlePaymentModalOpen()}
                                    />
                                )
                            }
                        </>
                    )
                }
                {
                    paymentbtnShow.props?.text === 'paid' && (
                        <Link to={`${returnURL}`} className='px-3 py-1 text-decoration-none text-dark w-100 d-inline-block'>{name} Return </Link>
                    )
                }
                <Link to={`${detailsURL}`} className='px-3 py-1 text-decoration-none text-dark w-100 d-inline-block'>{name} Details </Link>
                {
                    deletepermission && (
                        <Button
                            type='button'
                            className='px-3 py-1 d-inline-block w-100 bg-transparent border-0 text-start'
                            text='Delete'
                            onclick={deletedata}
                        />
                    )
                }
            </DropdownButton>
        </>
    )
}
export default React.memo(DropDownMenu)