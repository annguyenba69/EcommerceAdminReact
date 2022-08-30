import { Button, Input, Radio, Select, Table, Tag, Tooltip, Upload } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, UploadOutlined, CheckOutlined, RollbackOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addSlide, changeStatusSlide, confirmForceDeleteSlide, confirmSoftDeleteSlide, getAllSlides, restoreSlide } from '../../../redux/reducers/SlideReducer';
import { DOMAIN } from '../../../utils/configSystem';
import { NavLink, useSearchParams } from 'react-router-dom';
import { restorePost } from '../../../redux/reducers/PostReducer';
export default function AdminListSlide() {
    const dispatch = useDispatch();
    const { listSlides, num } = useSelector(state => state.SlideReducer);
    const [page, setPage] = React.useState(1);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [searchParams] = useSearchParams();
    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };
    const formik = useFormik({
        initialValues: {
            file: null,
            status: '',
        },
        validationSchema: Yup.object({
            status: Yup.string()
                .required('Status field is required'),
        }),
        onSubmit: values => {
            let formData = new FormData();
            for (let key in values) {
                if (key !== 'file') {
                    formData.append(key, values[key]);
                } else {
                    formData.append("file", values.file);
                }
            }
            dispatch(addSlide(formData));
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
            title: 'Image',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (text, record, index) => {
                return <img style={{ width: '50px' }} src={DOMAIN + text} alt="" />
            },
            width: '25%'
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
                    {searchParams.get('status') !== 'trash' ? <> <Tooltip title="Change Status">
                        <Button onClick={() => {
                            dispatch(changeStatusSlide(record.id))
                        }} type="primary" shape="circle" icon={<CheckOutlined />} size="large" />
                    </Tooltip>
                        <Tooltip title="Soft Delete">
                            <Button onClick={() => {
                                dispatch(confirmSoftDeleteSlide(record.id));
                            }} className='ml-2' type="danger" shape="circle" icon={<DeleteOutlined />} size="large" />
                        </Tooltip>
                    </> : <> <Tooltip title="Restore">
                        <Button onClick={() => {
                            dispatch(restoreSlide(record.id))
                        }} type="primary" shape="circle" icon={<RollbackOutlined />} size="large" />
                    </Tooltip>
                        <Tooltip title="Force Delete">
                            <Button onClick={() => {
                                dispatch(confirmForceDeleteSlide(record.id));
                            }} className='ml-2' type="danger" shape="circle" icon={<DeleteOutlined />} size="large" />
                        </Tooltip>
                    </>}
                </>)
            },
            width: '15%'
        },

    ];

    const onChangeStatus = (e) => {
        formik.setFieldValue('status', e.target.value);
    };

    // const onChangeFile = (event) => {
    //     let file = event.target.files[0];
    //     let reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     formik.setFieldValue('file', file);
    // }

    const onChangeFile = (file) => {
        console.log(file);
        formik.setFieldValue('file', file.file);
    }

    useEffect(() => {
        if (searchParams.get('status') !== null) {
            dispatch(getAllSlides("trash"));
        } else {
            dispatch(getAllSlides());
        }
    }, [searchParams]);

    return (
        <div className='row'>
            <div className='col-md-3'>
                <div className="card">
                    <div className="card-header font-weight-bold d-flex  align-items-center">
                        <h5 className="m-0 ">Add Slide</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="form-group">
                                {/* <input onChange={onChangeFile} multiple type="file" accept="image/png, image/jpeg, image/jpg" /> */}
                                <Upload
                                    action="http://localhost:3000"
                                    listType="picture"
                                    beforeUpload={(file) => {
                                        return false
                                    }}
                                    onChange={onChangeFile}
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
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
                        <h5 className="m-0 ">List Slides</h5>
                    </div>
                    <div className="card-body">
                        <div className='d-flex justify-content-between mb-4'>
                            <div className="analytic">
                                <NavLink to={"/admin/slide/list-slide"} className="text-primary">Active <span className="text-muted">({num.numSlide})</span></NavLink>
                                <NavLink to={"/admin/slide/list-slide?status=trash"} className="text-primary ml-2">Trash<span className="text-muted">({num.numTrashedSlide})</span></NavLink>
                            </div>
                        </div>
                        <>
                            <Table columns={columns} dataSource={listSlides} onChange={handleChange} pagination={{
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
