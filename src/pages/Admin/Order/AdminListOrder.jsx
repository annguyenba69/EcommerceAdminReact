import React, { useRef, useState } from 'react'
import { Button, Table, Tooltip, Input, Select } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tag } from 'antd';
import moment from 'moment';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { NavLink, useSearchParams } from 'react-router-dom';
import _ from 'lodash';
import { getAllOrders, getDetailOrder } from '../../../redux/reducers/OrderReducer';
import AdminDetailOrder from './AdminDetailOrder';
import { setVisibleTrueAction } from '../../../redux/reducers/DrawerReducer';
const { Search } = Input;

export default function AdminListOrder() {
    const dispatch = useDispatch();
    const { listOrders, num } = useSelector(state => state.OrderReducer);
    const [page, setPage] = React.useState(1);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [searchParams] = useSearchParams();
    const searchRef = useRef(null);

    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
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
            title: 'Name',
            dataIndex: 'user',
            key: 'name',
            render: (text, record, index) => {
                return <span>{text.name}</span>
            },
        },
        {
            title: 'Email',
            dataIndex: 'user',
            key: 'email',
            render: (text, record, index) => {
                return <span>{text.email}</span>
            },
        },
        {
            title: 'Phone',
            dataIndex: 'user',
            key: 'phone',
            render: (text, record, index) => {
                return <span>{text.phone}</span>
            },
        },
        {
            title: 'Order Status',
            dataIndex: 'order_status',
            key: 'order_status',
            render: (text, record, index) => {
                if (text.id === 1) {
                    return  <Tag color="geekblue">
                        {text.name}
                    </Tag>
                } else if (text.id === 2) {
                    return <Tag color="purple">
                        {text.name}
                    </Tag>
                }
                else if (text.id === 3) {
                    return  <Tag color="green">
                        {text.name}
                    </Tag>
                }
                else if (text.id === 4) {
                    return <Tag color="red">
                        {text.name}
                    </Tag>
                }
            },
        },
        {
            title: 'Total Price',
            dataIndex: 'total',
            key: 'total',
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text, record, index) => {
                return moment(text).format("DD/MM/YYYY");
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record, index) => {
                return <>
                    <Tooltip title="Detail Order">
                        <Button onClick={async() => {
                             let payload = {
                                title: "Detail Order",
                                Component: <AdminDetailOrder></AdminDetailOrder>,
                            }
                            await dispatch(getDetailOrder(record.id));
                            await dispatch(setVisibleTrueAction(payload));
                        }} type="primary" shape="circle" icon={<EyeOutlined />} size="large" />
                    </Tooltip>
                    <Tooltip title="Soft Delete">
                        <Button onClick={() => {
                            
                        }} className='ml-2' type="danger" shape="circle" icon={<DeleteOutlined />} size="large" />
                    </Tooltip>
                </>
            },
            width: '13%'
        },

    ];
    useEffect(() => {
        if (searchParams.get('order_status_id') !== null) {
            dispatch(getAllOrders(searchParams.get('order_status_id')));
        } else {
            dispatch(getAllOrders());
        }
    }, [searchParams]);

    const handleSearch = (e) => {
        if (searchRef.current) {
            clearTimeout(searchRef.current)
        }
        searchRef.current = setTimeout(() => {
            if (searchParams.get('order_status_id') !== null) {
                dispatch(getAllOrders(searchParams.get('order_status_id'), e.target.value));
            } else {
                dispatch(getAllOrders("", e.target.value));
            }
        }, 300)
    }
    return (
        <div className="card">
            <div className="card-header font-weight-bold d-flex  align-items-center">
                <h5 className="m-0 ">List Orders</h5>
            </div>
            <div className="card-body">
                <div className='d-flex justify-content-between mb-4'>
                    <div className="analytic">
                        <NavLink to={"/admin/order/list-order"} className="text-primary">Toàn Bộ<span className="text-muted">({num.numOrder})</span></NavLink>
                        <NavLink to={"/admin/order/list-order?order_status_id=1"} className="text-primary ml-2">Đang Xử Lý<span className="text-muted">({num.numPending})</span></NavLink>
                        <NavLink to={"/admin/order/list-order?order_status_id=2"} className="text-primary ml-2">Đang Giao Hàng<span className="text-muted">({num.numDelivery})</span></NavLink>
                        <NavLink to={"/admin/order/list-order?order_status_id=3"} className="text-primary ml-2">Hoàn Thành<span className="text-muted">({num.numComplete})</span></NavLink>
                        <NavLink to={"/admin/order/list-order?order_status_id=4"} className="text-primary ml-2">Hủy Đơn<span className="text-muted">({num.numCancel})</span></NavLink>
                    </div>
                    <form>
                        <Search style={{
                        }} size="large" placeholder="input search text" onChange={handleSearch} enterButton />
                    </form>
                </div>
                <>
                    <Table columns={columns} dataSource={listOrders} onChange={handleChange} pagination={{
                        onChange(current) {
                            setPage(current);
                        },
                        pageSize: 6,
                    }} rowKey="id" />
                </>

                <nav aria-label="Page navigation example">
                </nav>
            </div>
        </div>
    )
}
