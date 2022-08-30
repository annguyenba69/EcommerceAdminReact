import React from 'react'
import { UserOutlined, MediumOutlined, PhoneOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibleFalseAction } from '../../../redux/reducers/DrawerReducer';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { getAllListRoles } from '../../../redux/reducers/RoleReducer';
import { editUser } from '../../../redux/reducers/UserReducer';
const { Option } = Select;

export default function AdminEditUser() {
    const dispatch = useDispatch();
    const { allListRoles } = useSelector(state => state.RoleReducer);
    const { detailUser, userLogin } = useSelector(state => state.UserReducer);
    console.log(detailUser);
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: detailUser?.name,
            email: detailUser?.email,
            phone: detailUser?.phone,
            password: '',
            role_id: detailUser?.role_id
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
                .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/, 'Password must contain at least 6 characters including special characters, uppercase, lowercase and numbers'),
        }),
        onSubmit: values => {
            dispatch(editUser(values));
        },
    });
    const renderOptions = () => {
        return allListRoles?.map((role, index) => {
            return <Option key={index} value={role.id}>{role.name}</Option>
        })

    }

    useEffect(() => {
        dispatch(getAllListRoles());
    }, []);
    const handleChange = (value) => {
        formik.setFieldValue("role_id", value);
    };

    return (
        <form>
            <Row gutter={16}>
                <Col span={12}>
                    <p className='font-weight-bold'>Name</p>
                    <Input onChange={formik.handleChange} value={formik.values.name} name='name' size="large" prefix={<UserOutlined />} />
                    {formik.touched.name && formik.errors.name ? (
                        <div className='text-danger'>{formik.errors.name}</div>
                    ) : null}
                </Col>
                <Col span={12}>
                    <p className='font-weight-bold'>Email</p>
                    <Input disabled onChange={formik.handleChange} value={formik.values.email} name='email' size="large" prefix={<MediumOutlined />} />
                    {formik.touched.email && formik.errors.email ? (
                        <div className='text-danger'>{formik.errors.email}</div>
                    ) : null}
                </Col>
            </Row>
            <Row gutter={16} className="mt-3">
                <Col span={12}>
                    <p className='font-weight-bold'>Phone</p>
                    <Input onChange={formik.handleChange} value={formik.values.phone} name='phone' size="large" placeholder="Phone" prefix={<PhoneOutlined />} />
                    {formik.touched.phone && formik.errors.phone ? (
                        <div className='text-danger'>{formik.errors.phone}</div>
                    ) : null}
                </Col>
                <Col span={12}>
                    <p className='font-weight-bold'>Password</p>
                    <Input.Password value={formik.values.password} onChange={formik.handleChange} name='password' size="large" placeholder="Password" prefix={<SecurityScanOutlined />} />
                    {formik.touched.name && formik.errors.password ? (
                        <div className='text-danger'>{formik.errors.password}</div>
                    ) : null}
                </Col>
            </Row>
            <Row gutter={16} className="mt-3">
                <Col span={24}>
                    {detailUser.id !== userLogin.id ? <> <p className='font-weight-bold'>Role</p>
                        <Select
                            placeholder="Select Role"
                            size='large'
                            style={{ width: '100%' }}
                            value={formik.values.role_id}
                            onChange={handleChange}
                        >
                            {renderOptions()}
                        </Select></> : ""}

                </Col>
            </Row>
            <Row gutter={16} className="mt-3">
                <Col span={24} className="text-right">
                    <Button size="large" className='mr-3' onClick={() => {
                        dispatch(setVisibleFalseAction());
                    }}>Cancel</Button>
                    <Button size="large" onClick={() => {
                        formik.handleSubmit()
                    }} type="primary">
                        Submit
                    </Button>
                </Col>

            </Row>
        </form>
    )
}
