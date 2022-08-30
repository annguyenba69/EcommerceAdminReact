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
import { confirmSoftDeleteProduct, getAllListProducts, getDetailProduct, restoreProduct, setDetailProductAction, softDeleteProduct } from '../../../redux/reducers/ProductReducer';
import { DOMAIN } from '../../../utils/configSystem';
import { confirmForceDeletePost, confirmSoftDeletePost, getAllPosts, restorePost } from '../../../redux/reducers/PostReducer';
const { Search } = Input;

export default function AdminListPost() {
    const dispatch = useDispatch();
    const { allListPosts, numberPosts } = useSelector(state => state.PostReducer);
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
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (text, record, index) => {
                return <img style={{ width: '50px' }} src={DOMAIN + text} alt="" />
            },
            width: "8%"
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
            render: (text, record, index) => {
                return <span>{text.length > 50 ? text.substring(0, 50) + "...": text }</span>
            },
        },
        {
            title: 'Category',
            dataIndex: 'post_categories',
            key: 'post_categories',
            render: (text, record, index) => {
                return text.map((category, index) => {
                    return <Tag className='mb-1' color="green" key={index}>{category.name}</Tag>
                })
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
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
                        <Tooltip title="Edit Post">
                            <Button onClick={ () => {
                                history.push(`/admin/post/edit-post/${record.id}`)
                            }} type="primary" shape="circle" icon={<EditOutlined />} size="large" />
                        </Tooltip>
                        <Tooltip title="Soft Delete">
                            <Button onClick={() => {
                                dispatch(confirmSoftDeletePost(record.id));
                            }} className='ml-2' type="danger" shape="circle" icon={<DeleteOutlined />} size="large" />
                        </Tooltip></> : <>
                        <Tooltip title="Restore">
                            <Button onClick={async () => {
                                dispatch(restorePost(record.id));
                            }} type="primary" shape="circle" icon={<RollbackOutlined />} size="large" />
                        </Tooltip>
                        <Tooltip title="Force Delete">
                            <Button onClick={() => {
                                dispatch(confirmForceDeletePost(record.id));
                            }} className='ml-2' type="danger" shape="circle" icon={<DeleteOutlined />} size="large" />
                        </Tooltip></>}
                </>)
            },
            width: '13%'
        },

    ];
    useEffect(() => {
        if (searchParams.get('status') !== null) {
            dispatch(getAllPosts("trash"));
        } else {
            dispatch(getAllPosts());
        }
    }, [searchParams]);
    const handleSearch = (e) => {
        if (searchRef.current) {
            clearTimeout(searchRef.current)
        }
        searchRef.current = setTimeout(() => {
            if (searchParams.get('status') !== null) {
                dispatch(getAllPosts("trash", e.target.value));
            } else {
                dispatch(getAllPosts("", e.target.value));
            }
        }, 300)
    }
    return (
        <div className="card">
            <div className="card-header font-weight-bold d-flex  align-items-center">
                <h5 className="m-0 ">List Posts</h5>
            </div>
            <div className="card-body">
                <div className='d-flex justify-content-between mb-4'>
                    <div className="analytic">
                        <NavLink to={"/admin/post/list-post"} className="text-primary">Active <span className="text-muted">({numberPosts?.numberActivePosts})</span></NavLink>
                        <NavLink to={"/admin/post/list-post?status=trash"} className="text-primary ml-2">Trash<span className="text-muted">({numberPosts?.numberTrashPosts})</span></NavLink>
                    </div>
                    <form>
                        <Search style={{
                        }} size="large" placeholder="input search text" onChange={handleSearch} enterButton />
                    </form>
                </div>
                <>
                    <Table columns={columns} dataSource={allListPosts} onChange={handleChange} pagination={{
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
