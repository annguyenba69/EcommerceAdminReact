import React, { useState } from 'react'
import { UserOutlined, MediumOutlined, PhoneOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Table, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibleFalseAction } from '../../../redux/reducers/DrawerReducer';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { getAllListRoles } from '../../../redux/reducers/RoleReducer';
import { editUser } from '../../../redux/reducers/UserReducer';
import moment from 'moment';
import { DOMAIN } from '../../../utils/configSystem';
import { getAllOrderStatus } from '../../../redux/reducers/OrderStatusReducer';
import { editOrder } from '../../../redux/reducers/OrderReducer';
const { Option } = Select;

export default function AdminDetailOrder() {
    const dispatch = useDispatch();
    const { listOrderStatuses } = useSelector(state => state.OrderStatusReducer);
    const { detailOrder } = useSelector(state => state.OrderReducer);
    const [page, setPage] = React.useState(1);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: detailOrder?.id,
            order_status_id: detailOrder?.order_status_id
        },
        onSubmit: values => {
            dispatch(editOrder(values));
        },
    });
    const renderOptions = () => {
        return listOrderStatuses?.map((orderStatus, index) => {
            return <Option key={index} value={orderStatus.id}>{orderStatus.name}</Option>
        })
    }

    useEffect(() => {
        dispatch(getAllOrderStatus());
    }, []);

    const handleChangeOrderStatus = (value) => {
        formik.setFieldValue("order_status_id", value);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (text, record, index) => {
                return (page - 1) * 6 + index
            },
        },
        {
            title: 'Image',
            dataIndex: 'product_thumbnails',
            key: 'image',
            render: (text, record, index) => {
                return <img style={{ width: '50px' }} src={DOMAIN + text[0].thumbnail} alt="" />
            },
            width: "8%"
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (text, record, index) => {
                return <span>{text.toLocaleString() + "đ"}</span>
            },
        },
        {
            title: 'Quantity',
            dataIndex: 'pivot',
            key: 'quantity',
            render: (text, record, index) => {
                return <span>{text.quantity}</span>
            },
        },
        {
            title: 'Total',
            dataIndex: 'pivot',
            key: 'total',
            render: (text, record, index) => {
                return <span>{text.total.toLocaleString() + "đ"}</span>
            },
        },
    ];
    return (
        <form>
            <Row gutter={16}>
                <Col span={24}>
                    <label>Address</label>
                    <br></br>
                    <Tag className='px-3 py-1' color="green">{detailOrder?.address}</Tag>
                </Col>
                <Col span={24}>
                    <label>Note</label>
                    <br></br>
                    <Tag className='px-3 py-1' color="green">{detailOrder?.note}</Tag>
                </Col>
                <Col span={24}>
                    <label>Payment Method</label>
                    <br></br>
                    {detailOrder?.payment_method_id === "1" ? <>
                        <Tag className='px-3 py-1' color="green">Thanh Toán Tại Nhà</Tag>
                    </> : <Tag className='px-3 py-1' color="green">Thanh Toán Tại Cửa Hàng</Tag>}

                </Col>
                <Col span={24}>
                    <label>Total Order Amount</label>
                    <br></br>
                    <Tag className='px-3 py-1' color="green">{detailOrder?.total.toLocaleString() + "đ"}</Tag>
                </Col>
                <form>
                    <Col span={24}>
                        <label>Order Status</label>
                        <Select
                            placeholder="Select Order Status"
                            size='large'
                            style={{ width: '100%' }}
                            value={formik.values.order_status_id}
                            onChange={handleChangeOrderStatus}
                        >
                            {renderOptions()}
                        </Select>
                        <Button className='mt-2' size="large" onClick={() => {
                            formik.handleSubmit()
                        }} type="primary">
                            Submit
                        </Button>
                    </Col>
                </form>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <p className='font-weight-bold'>Detail Order</p>
                    <>
                        <Table columns={columns} dataSource={detailOrder?.products} onChange={handleChange} pagination={{
                            onChange(current) {
                                setPage(current);
                            },
                            pageSize: 6,
                        }} rowKey="id" />
                    </>
                </Col>
            </Row>
        </form>
    )
}
