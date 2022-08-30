import React from 'react'
import './LoginRegister.css';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input, Space } from 'antd';
import { UserOutlined, MediumOutlined, PhoneOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import { register } from '../../../redux/reducers/UserReducer';
export default function Register(props) {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            password_confirmation: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Name field is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email field is required'),
            phone: Yup.string()
                .required('Phone field is required')
                .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Phone number is not valid'),
            password: Yup.string()
                .required('Password field is required')
                .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/, 'Password must contain at least 6 characters including special characters, uppercase, lowercase and numbers'),
            password_confirmation: Yup.string()
                .required('Password Confirmation field is required')
                .oneOf([Yup.ref('password'), null], 'Password Confirmation must match')
        }),
        onSubmit: values => {
            dispatch(register(values));
        },
    });
    return (
        <div>
            <h3 className='text-center mb-5'>Register</h3>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <Input onChange={formik.handleChange} name='name' size="small" placeholder="Name" prefix={<UserOutlined />} style={{ fontSize: '20px' }} />
                    {formik.touched.name && formik.errors.name ? (
                        <div className='text-danger'>{formik.errors.name}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <Input onChange={formik.handleChange} name='email' size="small" placeholder="Email" prefix={<MediumOutlined />} style={{ fontSize: '20px' }} />
                    {formik.touched.email && formik.errors.email ? (
                        <div className='text-danger'>{formik.errors.email}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <Input onChange={formik.handleChange} name='phone' size="small" placeholder="Phone" prefix={<PhoneOutlined />} style={{ fontSize: '20px' }} />
                    {formik.touched.phone && formik.errors.phone ? (
                        <div className='text-danger'>{formik.errors.phone}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <Input.Password onChange={formik.handleChange} name='password' size="small" placeholder="Password" prefix={<SecurityScanOutlined />} style={{ fontSize: '20px' }} />
                    {formik.touched.password && formik.errors.password ? (
                        <div className='text-danger'>{formik.errors.password}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <Input.Password onChange={formik.handleChange} name='password_confirmation' size="small" placeholder="Confirmation Password" prefix={<SecurityScanOutlined />} style={{ fontSize: '20px' }} />
                    {formik.touched.password_confirmation && formik.errors.password_confirmation ? (
                        <div className='text-danger'>{formik.errors.password_confirmation}</div>
                    ) : null}
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center"><input name type="checkbox" defaultValue /> <span className="pl-2 font-weight-bold">Remember Me</span></div>
                    <div><a href="#">Forget Password?</a></div>
                </div>
                <div className="pb-2">
                    <button type="submit" className="btn btn-dark w-100 font-weight-bold mt-2">Submit</button>
                </div>
            </form>
            <div className="sideline">OR</div>
            <div>
                <button type="submit" className="btn btn-primary w-100 font-weight-bold mt-2"><i className="fa fa-facebook" aria-hidden="true" /> Login With Facebook</button>
            </div>
            <div className="pt-4 text-center">
                Get Members Benefit. <a href="#">Sign Up</a>
            </div>
        </div>
    )
}
