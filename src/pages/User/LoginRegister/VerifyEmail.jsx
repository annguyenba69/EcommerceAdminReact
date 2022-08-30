import React, { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import Axios from 'axios'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../../../redux/reducers/UserReducer';

export default function VerifyEmail() {
    const { visible, setVisible } = useState(false);
    const {verifyEmailMessage} = useSelector(state => state.UserReducer);
    let { id, hash } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(verifyEmail(id, hash));
    }, []);
    return (
        <div className='container'>
            <h3 className='text-center mb-5'>{verifyEmailMessage}</h3>
            <div className='text-center'>
                <img style={{ width: '150px' }} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnuZPTt-j8oZcnty_RXVKqgCZVTFXQitjVqQ&usqp=CAU" />
            </div>
            <div className='message text-center mt-5'>
                <NavLink to={"/login"} className='btn btn-primary'>LOGIN TO YOUR ACCOUNT</NavLink>
            </div>
        </div>
    )
}
