import React from 'react'
import './LoginRegister.css';
import { Input } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { MediumOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { login } from '../../../redux/reducers/UserReducer';
export default function Login() {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email field is required'),
            password: Yup.string()
                .required('Password field is required')
        }),
        onSubmit: values => {
            dispatch(login(values));
        },
    });
    return (
        <div>
            <h3 className='text-center mb-5'>Login</h3>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <Input onChange={formik.handleChange} name='email' size="small" placeholder="Email" prefix={<MediumOutlined />} style={{ fontSize: '20px' }} />
                    {formik.touched.email && formik.errors.email ? (
                        <div className='text-danger'>{formik.errors.email}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <Input.Password onChange={formik.handleChange} name='password' size="small" placeholder="Password" prefix={<SecurityScanOutlined />} style={{ fontSize: '20px' }} />
                    {formik.touched.password && formik.errors.password ? (
                        <div className='text-danger'>{formik.errors.password}</div>
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
