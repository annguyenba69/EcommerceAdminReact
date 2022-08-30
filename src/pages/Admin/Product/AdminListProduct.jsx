import React, { useRef, useState } from 'react'
import { Button, Table, Tooltip, Input, Select } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmDeleteUser, ConfirmForceDeleteUser, deleteUser, detailUser, findUserByKeyword, getAllListUsers, restoreUser } from '../../../redux/reducers/UserReducer';
import { Tag } from 'antd';
import moment from 'moment';
import { EditOutlined, DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import { history } from '../../../App';
import { setVisibleTrueAction } from '../../../redux/reducers/DrawerReducer';
import { NavLink, useSearchParams } from 'react-router-dom';
import _ from 'lodash';
import { confirmForceDeleteProduct, confirmSoftDeleteProduct, getAllListProducts, getDetailProduct, restoreProduct, setDetailProductAction, softDeleteProduct } from '../../../redux/reducers/ProductReducer';
import { DOMAIN } from '../../../utils/configSystem';
import AdminEditProduct from './AdminEditProduct';
const { Search } = Input;

export default function AdminListProduct() {
    const dispatch = useDispatch();
    const { allListProducts, numberProduct } = useSelector(state => state.ProductReducer);
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
            width: "7%"
        },
        {
            title: 'Image',
            dataIndex: 'product_thumbnails',
            key: 'product_thumbnails',
            render: (text, record, index) => {
                return <img style={{ width: '50px' }} src={DOMAIN + text[0].thumbnail} alt="" />
            },
            width: "8%"
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
        },
        {
            title: 'Category',
            dataIndex: 'product_categories',
            key: 'product_categories',
            render: (text, record, index) => {
                return text.map((category, index) => {
                    return <Tag className='mb-1' color="green" key={index}>{category.name}</Tag>
                })
            },
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
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            render: (text, record, index) => {
                return <Tag color="green">{text.name}</Tag>
            },
        },
        {
            title: 'Public',
            dataIndex: 'status_public',
            key: 'status_public',
            render: (text, record, index) => {
                return text === "1" ? <Tag color="green">Public</Tag> : <Tag color="red">Pending</Tag>
            },
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
                return (<>
                    {searchParams.get('status') == null ? <>
                        <Tooltip title="Edit Product">
                            <Button onClick={ () => {
                                history.push(`/admin/product/edit-product/${record.id}`)
                            }} type="primary" shape="circle" icon={<EditOutlined />} size="large" />
                        </Tooltip>
                        <Tooltip title="Soft Delete">
                            <Button onClick={() => {
                                dispatch(confirmSoftDeleteProduct(record.id));
                            }} className='ml-2' type="danger" shape="circle" icon={<DeleteOutlined />} size="large" />
                        </Tooltip></> : <>
                        <Tooltip title="Restore">
                            <Button onClick={async () => {
                                dispatch(restoreProduct(record.id));
                            }} type="primary" shape="circle" icon={<RollbackOutlined />} size="large" />
                        </Tooltip>
                        <Tooltip title="Force Delete">
                            <Button onClick={() => {
                                dispatch(confirmForceDeleteProduct(record.id));
                            }} className='ml-2' type="danger" shape="circle" icon={<DeleteOutlined />} size="large" />
                        </Tooltip></>}
                </>)
            },
            width: '13%'
        },

    ];
    useEffect(() => {
        if (searchParams.get('status') !== null) {
            dispatch(getAllListProducts("trash"));
        } else {
            dispatch(getAllListProducts());
        }
    }, [searchParams]);
    const handleSearch = (e) => {
        if (searchRef.current) {
            clearTimeout(searchRef.current)
        }
        searchRef.current = setTimeout(() => {
            if (searchParams.get('status') !== null) {
                dispatch(getAllListProducts("trash", e.target.value));
            } else {
                dispatch(getAllListProducts("", e.target.value));
            }
        }, 300)
    }
    return (
        <div className="card">
            <div className="card-header font-weight-bold d-flex  align-items-center">
                <h5 className="m-0 ">List Products</h5>
            </div>
            <div className="card-body">
                <div className='d-flex justify-content-between mb-4'>
                    <div className="analytic">
                        <NavLink to={"/admin/product/list-product"} className="text-primary">Active <span className="text-muted">({numberProduct?.numberActiveProducts})</span></NavLink>
                        <NavLink to={"/admin/product/list-product?status=trash"} className="text-primary ml-2">Trash<span className="text-muted">({numberProduct?.numberTrashProducts})</span></NavLink>
                    </div>
                    <form>
                        <Search style={{
                        }} size="large" placeholder="input search text" onChange={handleSearch} enterButton />
                    </form>
                </div>
                <>
                    <Table columns={columns} dataSource={allListProducts} onChange={handleChange} pagination={{
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
