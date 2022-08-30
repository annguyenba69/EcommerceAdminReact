import React, { useRef, useState } from 'react'
import { Button, Table, Tooltip, Input } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tag } from 'antd';
import moment from 'moment';
import { EditOutlined, DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import { NavLink, useSearchParams } from 'react-router-dom';
import _ from 'lodash';
import { confirmForceDeletePage, confirmSoftDeletePage, getAllListPages, restorePage } from '../../../redux/reducers/PageReducer';
const { Search } = Input;

export default function AdminListPage() {
    const dispatch = useDispatch();
    const { listPages, num } = useSelector(state => state.PageReducer);
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
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
                        <Tooltip title="Edit Page">
                            <Button onClick={ () => {

                            }} type="primary" shape="circle" icon={<EditOutlined />} size="large" />
                        </Tooltip>
                        <Tooltip title="Soft Delete">
                            <Button onClick={() => {
                                dispatch(confirmSoftDeletePage(record.id));
                            }} className='ml-2' type="danger" shape="circle" icon={<DeleteOutlined />} size="large" />
                        </Tooltip></> : <>
                        <Tooltip title="Restore">
                            <Button onClick={async () => {
                                dispatch(restorePage(record.id));
                            }} type="primary" shape="circle" icon={<RollbackOutlined />} size="large" />
                        </Tooltip>
                        <Tooltip title="Force Delete">
                            <Button onClick={() => {
                                dispatch(confirmForceDeletePage(record.id));
                            }} className='ml-2' type="danger" shape="circle" icon={<DeleteOutlined />} size="large" />
                        </Tooltip></>}
                </>)
            },
            width: '13%'
        },

    ];
    useEffect(() => {
        if (searchParams.get('status') !== null) {
            dispatch(getAllListPages("trash"));
        } else {
            dispatch(getAllListPages());
        }
    }, [searchParams]);
    const handleSearch = (e) => {
        if (searchRef.current) {
            clearTimeout(searchRef.current)
        }
        searchRef.current = setTimeout(() => {
            if (searchParams.get('status') !== null) {
                dispatch(getAllListPages("trash", e.target.value));
            } else {
                dispatch(getAllListPages("", e.target.value));
            }
        }, 300)
    }
    return (
        <div className="card">
            <div className="card-header font-weight-bold d-flex  align-items-center">
                <h5 className="m-0 ">List Pages</h5>
            </div>
            <div className="card-body">
                <div className='d-flex justify-content-between mb-4'>
                    <div className="analytic">
                        <NavLink to={"/admin/page/list-page"} className="text-primary">Active <span className="text-muted">({num?.numPages})</span></NavLink>
                        <NavLink to={"/admin/page/list-page?status=trash"} className="text-primary ml-2">Trash<span className="text-muted">({num?.numTrashPages})</span></NavLink>
                    </div>
                    <form>
                        <Search style={{
                        }} size="large" placeholder="input search text" onChange={handleSearch} enterButton />
                    </form>
                </div>
                <>
                    <Table columns={columns} dataSource={listPages} onChange={handleChange} pagination={{
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
