import React, { useRef, useState } from 'react'
import { Button, Table, Tooltip, Input, Select } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmDeleteUser, ConfirmForceDeleteUser, deleteUser, detailUser, findUserByKeyword, getAllListUsers, restoreUser } from '../../../redux/reducers/UserReducer';
import { Tag } from 'antd';
import moment from 'moment';
import { EditOutlined, DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import './AdminListUser.css';
import { history } from '../../../App';
import { setVisibleTrueAction } from '../../../redux/reducers/DrawerReducer';
import AdminEditUser from './AdminEditUser';
import { NavLink, useSearchParams } from 'react-router-dom';
import _ from 'lodash';
const { Search } = Input;

export default function AdminListUser() {
    const dispatch = useDispatch();
    const [page, setPage] = React.useState(1);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const { allListUsers, numberUser } = useSelector(state => state.UserReducer);
    const { userLogin } = useSelector(state => state.UserReducer);
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
            width: ' 5%',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
            width: '15%'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '20%'
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: '14%'
        },
        {
            title: 'Role',
            dataIndex: 'role_id',
            key: 'role_id',
            render: (text, record, index) => {
                return text === 1 ? <Tag color="green">Admin</Tag> : <Tag color="green">User</Tag>
            },
            width: '10%'
        },
        {
            title: 'Verify',
            dataIndex: 'email_verified_at',
            key: 'email_verified_at',
            render: (text, record, index) => {
                return text !== null ? <Tag color="green">Verify</Tag> : <Tag color="red">Not Verify</Tag>
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
            width: '13%'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record, index) => {
                return (<>
                    {searchParams.get('status') !== 'trash' ? <Tooltip title="Edit">
                        <Button onClick={async () => {
                            let payload = {
                                title: "Edit User",
                                Component: <AdminEditUser></AdminEditUser>,
                            }
                            await dispatch(detailUser(record.id));
                            await dispatch(setVisibleTrueAction(payload));
                        }} type="primary" shape="circle" icon={<EditOutlined />} size="large" />
                    </Tooltip> : <Tooltip title="Restore">
                        <Button onClick={() => {
                            dispatch(restoreUser(record.id));
                        }} type="primary" shape="circle" icon={<RollbackOutlined />} size="large" />
                    </Tooltip>}
                    {record.id !== userLogin.id && searchParams.get('status') !== 'trash' ? <Tooltip title="Delete">
                        <Button onClick={() => {
                            dispatch(ConfirmDeleteUser(record.id));
                        }} className='ml-2' type="danger" shape="circle" icon={<DeleteOutlined />} size="large" />
                    </Tooltip> : ''}
                    {record.id !== userLogin.id && searchParams.get('status') === 'trash' ? <Tooltip title="Force Delete">
                        <Button onClick={() => {
                            dispatch(ConfirmForceDeleteUser(record.id));
                        }} className='ml-2' type="danger" shape="circle" icon={<DeleteOutlined />} size="large" />
                    </Tooltip> : ''}
                </>)
            },
            width: '13%'
        },

    ];
    useEffect(() => {
        if (searchParams.get('status') !== null) {
            dispatch(getAllListUsers(searchParams.get('status')));
        } else {
            dispatch(getAllListUsers());
        }
    }, [searchParams]);
    const handleSearch = (e) => {
        if (searchRef.current) {
            clearTimeout(searchRef.current)
        }
        searchRef.current = setTimeout(() => {
            if (searchParams.get('status') !== null) {
                dispatch(findUserByKeyword(searchParams.get('status'), e.target.value));
            } else {
                dispatch(findUserByKeyword("all", e.target.value));
            }
        }, 300)
    }
    return (
        <div className="card">
            <div className="card-header font-weight-bold d-flex  align-items-center">
                <h5 className="m-0 ">List Users</h5>
            </div>
            <div className="card-body">
                <div className='d-flex justify-content-between mb-4'>
                    <div className="analytic">
                        <NavLink to={"/admin/user/list-user"} className="text-primary">Active <span className="text-muted">({numberUser.numberActiveUsers})</span></NavLink>
                        <NavLink to={"/admin/user/list-user?status=trash"} className="text-primary ml-2">Trash<span className="text-muted">({numberUser.numberTrashUsers})</span></NavLink>
                    </div>
                    <form>
                        <Search style={{
                        }} size="large" placeholder="input search text" onChange={handleSearch} enterButton />
                    </form>
                </div>
                <>
                    <Table columns={columns} dataSource={allListUsers} onChange={handleChange} pagination={{
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
