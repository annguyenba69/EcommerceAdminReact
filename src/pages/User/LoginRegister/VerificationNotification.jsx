import React from 'react'
import { NavLink } from 'react-router-dom'
import { TOKEN } from '../../../utils/configSystem'
import { Navigate } from "react-router-dom";
import { openNotificationWithIcon } from '../../../utils/notification';
export default function VerificationNotification() {
    const redirectToRegister = ()=>{
        openNotificationWithIcon('error', 'Error', 'You do not have permission to access this page')
        return (
            <Navigate to="/register" replace={true} />
        )
    }
    if (localStorage.getItem(TOKEN)) {
        return (
            <div className='container'>
                <h3 className='text-center mb-5'>Verification Notification</h3>
                <div className='text-center'>
                    <img style={{ width: '150px' }} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnuZPTt-j8oZcnty_RXVKqgCZVTFXQitjVqQ&usqp=CAU" />
                </div>
                <div className='message text-center'>
                    <p className='font-weight-bold mt-5' style={{ fontSize: '22px' }}>Hello,</p>
                    <p className='mb-5' style={{ fontSize: '17px' }}>Thank you, the account verification link has been automatically sent to your email. Go to your email and complete the account registration</p>
                    <NavLink to={"/login"} className='btn btn-primary'>LOGIN TO YOUR ACCOUNT</NavLink>
                </div>
            </div>
        )
    } else {
        return (
            <>
                {redirectToRegister()}
            </>
        )
    }

}
