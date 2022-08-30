import React from 'react'
import { CopyOutlined } from '@ant-design/icons';
import { Button, Col, Input, Radio, Row } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibleFalseAction } from '../../../redux/reducers/DrawerReducer';
import { editPostCat } from '../../../redux/reducers/PostCatReducer';
export default function AdminEditPostCat() {
    const { detailPostCat } = useSelector(state => state.PostCatReducer);
    const dispatch = useDispatch();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: detailPostCat?.id,
            name: detailPostCat?.name,
            status: detailPostCat?.status,
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .max(255, 'Must be 255 characters or less')
                .required('Name field is required'),
            status: Yup.string()
                .required('Status field is required'),
        }),
        onSubmit: values => {
            dispatch(editPostCat(values));
        },
    });
    const onChangeStatus = (e) => {
        formik.setFieldValue('status', e.target.value);
    };
    return (
        <form>
            <Row gutter={16}>
                <Col span={24}>
                    <p className='font-weight-bold'>Name</p>
                    <Input value={formik.values.name} onChange={formik.handleChange} name='name' placeholder="Name" prefix={<CopyOutlined />} style={{ fontSize: '20px' }} />
                    {formik.touched.name && formik.errors.name ? (
                        <div className='text-danger'>{formik.errors.name}</div>
                    ) : null}
                </Col>
            </Row>
            <Row gutter={16} className="mt-4">
                <Col span={12}>
                    <p className='font-weight-bold'>Status</p>
                    <Radio.Group onChange={onChangeStatus} value={formik.values.status}>
                        <Radio value="0">Pending</Radio>
                        <Radio value="1">Public</Radio>
                    </Radio.Group>
                    {formik.touched.status && formik.errors.status ? (
                        <div className='text-danger'>{formik.errors.status}</div>
                    ) : null}
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
