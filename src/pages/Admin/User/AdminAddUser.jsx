import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from 'antd';
import { UserOutlined, MediumOutlined, PhoneOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllListRoles } from '../../../redux/reducers/RoleReducer';
import { addUser } from '../../../redux/reducers/UserReducer';
const { Option } = Select;
export default function AdminAddUser() {
    const dispatch = useDispatch();
    const { allListRoles } = useSelector(state => state.RoleReducer);
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            password_confirmation: '',
            role_id: ''
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
                .oneOf([Yup.ref('password'), null], 'Password Confirmation must match'),
            role_id: Yup.number()
                .required('Role field is required')
        }),
        onSubmit: values => {
            dispatch(addUser(values));
        },
    });
    const handleChange = (value) => {
        formik.setFieldValue("role_id", value);
    };

    const renderOptions = () => {
        return allListRoles?.map((role, index) => {
            return <Option key={index} value={role.id}>{role.name}</Option>
        })

    }

    useEffect(() => {
        dispatch(getAllListRoles());
    }, []);

    return (
        <div className="card">
            <div className="card-header font-weight-bold d-flex  align-items-center">
                <h5 className="m-0 ">Add User</h5>
            </div>
            <div className="card-body">
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <Input onChange={formik.handleChange} name='name' size="large" placeholder="Name" prefix={<UserOutlined />} style={{ fontSize: '20px' }} />
                            {formik.touched.name && formik.errors.name ? (
                                <div className='text-danger'>{formik.errors.name}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <Input onChange={formik.handleChange} name='email' size="large" placeholder="Email" prefix={<MediumOutlined />} style={{ fontSize: '20px' }} />
                            {formik.touched.email && formik.errors.email ? (
                                <div className='text-danger'>{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <Input onChange={formik.handleChange} name='phone' size="large" placeholder="Phone" prefix={<PhoneOutlined />} style={{ fontSize: '20px' }} />
                            {formik.touched.phone && formik.errors.phone ? (
                                <div className='text-danger'>{formik.errors.phone}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <Input.Password onChange={formik.handleChange} name='password' size="large" placeholder="Password" prefix={<SecurityScanOutlined />} style={{ fontSize: '20px' }} />
                            {formik.touched.password && formik.errors.password ? (
                                <div className='text-danger'>{formik.errors.password}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <Input.Password onChange={formik.handleChange} name='password_confirmation' size="large" placeholder="Confirmation Password" prefix={<SecurityScanOutlined />} style={{ fontSize: '20px' }} />
                            {formik.touched.password_confirmation && formik.errors.password_confirmation ? (
                                <div className='text-danger'>{formik.errors.password_confirmation}</div>
                            ) : null}
                        </div>
                        <div className='form-group'>
                            <Select
                                placeholder="Select Role"
                                size='large'
                                style={{ width: '100%' }}
                                onChange={handleChange}
                            >
                                {renderOptions()}
                            </Select>
                            {formik.touched.role_id && formik.errors.role_id ? (
                                <div className='text-danger'>{formik.errors.role_id}</div>
                            ) : null}
                        </div>
                        <div className="pb-2">
                            <button type="submit" className="btn btn-dark w-100 font-weight-bold mt-2">Submit</button>
                        </div>
                    </form>
                </div>
                <nav aria-label="Page navigation example">
                </nav>
            </div>
        </div>

    )
}
