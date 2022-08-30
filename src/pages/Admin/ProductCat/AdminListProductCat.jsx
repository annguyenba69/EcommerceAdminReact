import { Button, Input, Radio, Select, Table, Tag, Tooltip } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { addProductCat, confirmDeleteProductCat, getAllListProductCats, getDetailProductCatById } from '../../../redux/reducers/ProductCatReducer';
import { EditOutlined, DeleteOutlined, UserOutlined, CopyOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AdminEditProductCat from './AdminEditProductCat';
import { setVisibleTrueAction } from '../../../redux/reducers/DrawerReducer';
const { Search } = Input;
const { Option } = Select;
export default function AdminListProductCat() {
    const dispatch = useDispatch();
    const { allListProductCats } = useSelector(state => state.ProductCatReducer);
    const [page, setPage] = React.useState(1);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const searchRef = useRef(null);
    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };
    const formik = useFormik({
        initialValues: {
            name: '',
            parent_id: '',
            status: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .max(255, 'Must be 255 characters or less')
                .required('Name field is required'),
            parent_id: Yup.number()
                .required('Parent field is required'),
            status: Yup.string()
                .required('Status field is required'),
        }),
        onSubmit: values => {
            dispatch(addProductCat(values));
            formik.resetForm();
        },
    });
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (text, record, index) => {
                return (page - 1) * 6 + index
            },
            width: '10%',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
            render: (text, record, index) => {
                return "---/".repeat(record.level) + text;
            },
            width: '25%'
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            width: '15%'
        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            render: (text, record, index) => {
                return <Tag color="green">{text.name}</Tag>
            },
            width: '15%'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record, index) => {
                return text === "1" ? <Tag color="green">Public</Tag> : <Tag color="red">Pending</Tag>
            },
            width: '10%'
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text, record, index) => {
                return moment(text).format("DD/MM/YYYY");
            },
            width: '15%'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record, index) => {
                return (<>
                    <Tooltip title="Edit">
                        <Button onClick={async () => {
                            let payload = {
                                title: "Edit Product Category",
                                Component: <AdminEditProductCat></AdminEditProductCat>,
                            }
                            await dispatch(getDetailProductCatById(record.id));
                            await dispatch(setVisibleTrueAction(payload));
                        }} type="primary" shape="circle" icon={<EditOutlined />} size="large" />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button onClick={() => {
                            dispatch(confirmDeleteProductCat(record.id))
                        }} className='ml-2' type="danger" shape="circle" icon={<DeleteOutlined />} size="large" />
                    </Tooltip>
                </>)
            },
            width: '15%'
        },

    ];

    const renderOptions = () => {
        return allListProductCats?.map((productCat, index) => {
            return <Option key={index + 1} value={productCat.id}>{"---/".repeat(productCat.level) + productCat.name}</Option>
        })
    }
    const onChangeStatus = (e) => {
        formik.setFieldValue('status', e.target.value);
    };

    const handleChangeSelect = (value) => {
        formik.setFieldValue('parent_id', value);
    };

    const handleSearch = (e) => {
        if (searchRef.current) {
            clearTimeout(searchRef.current)
        }
        searchRef.current = setTimeout(() => {
            dispatch(getAllListProductCats(e.target.value));
        }, 300)
    }

    useEffect(() => {
        dispatch(getAllListProductCats());
    }, []);

    return (
        <div className='row'>
            <div className='col-md-3'>
                <div className="card">
                    <div className="card-header font-weight-bold d-flex  align-items-center">
                        <h5 className="m-0 ">Add Product Categories</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="form-group">
                                <Input value={formik.values.name} onChange={formik.handleChange} name='name' placeholder="Name" prefix={<CopyOutlined />} style={{ fontSize: '20px' }} />
                                {formik.touched.name && formik.errors.name ? (
                                    <div className='text-danger'>{formik.errors.name}</div>
                                ) : null}
                            </div>
                            <div className='form-group'>
                                <Select
                                    value={formik.values.parent_id}
                                    placeholder="Select Parent Category"
                                    size='large'
                                    style={{ width: '100%' }}
                                    onChange={handleChangeSelect}
                                >
                                    <Option value="0">Danh Mục Gốc</Option>
                                    {renderOptions()}
                                </Select>
                                {formik.touched.parent_id && formik.errors.parent_id ? (
                                    <div className='text-danger'>{formik.errors.parent_id}</div>
                                ) : null}
                            </div>
                            <div className='form-group'>
                                <p>Status</p>
                                <Radio.Group onChange={onChangeStatus} value={formik.values.status}>
                                    <Radio value="0">Pending</Radio>
                                    <Radio value="1">Public</Radio>
                                </Radio.Group>
                                {formik.touched.status && formik.errors.status ? (
                                    <div className='text-danger'>{formik.errors.status}</div>
                                ) : null}
                            </div>
                            <div className='form-group'>
                                <Button htmlType="submit" type="primary" block size='large'>Add</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className='col-md-9'>
                <div className="card">
                    <div className="card-header font-weight-bold d-flex  align-items-center">
                        <h5 className="m-0 ">List Product Categories</h5>
                    </div>
                    <div className="card-body">
                        <div className='d-flex mb-4' style={{ justifyContent: 'right' }}>
                            <form>
                                <Search onChange={handleSearch} style={{
                                }} size="large" placeholder="input search text" enterButton />
                            </form>
                        </div>
                        <>
                            <Table columns={columns} dataSource={allListProductCats} onChange={handleChange} pagination={{
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
            </div>
        </div>

    )
}
