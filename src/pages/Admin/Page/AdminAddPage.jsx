import React, { useRef, useState } from 'react'
import { UserOutlined, } from '@ant-design/icons';
import { Input, Radio, } from 'antd';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import * as Yup from 'yup';
import { addPage } from '../../../redux/reducers/PageReducer';
export default function AdminAddPage() {
    const dispatch = useDispatch();
    const editorRef = useRef(null);
    const [imgSrc, setImgSrc] = useState([]);
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: "",
            content: "",
            status: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Name field is required'),
            content: Yup.string()
                .required('Content field is required'),
            status: Yup.number()
                .required('Status field is required'),
        }),
        onSubmit: values => {
            dispatch(addPage(values));
        },
    });


    const handleEditChange = () => {
        if (editorRef.current) {
            formik.setFieldValue('content', editorRef.current.getContent());
        }
    }

    return (
        <div className="card">
            <div className="card-header font-weight-bold d-flex  align-items-center">
                <h5 className="m-0 ">Add Page</h5>
            </div>
            <div className="card-body">
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className="form-group">
                                    <Input onChange={formik.handleChange} name='name' size="large" placeholder="Name" prefix={<UserOutlined />} style={{ fontSize: '20px' }} />
                                    {formik.touched.name && formik.errors.name ? (
                                        <div className='text-danger'>{formik.errors.name}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className='col-md-12'>
                                <div className="form-group">
                                    <Editor
                                        apiKey='mxc67ijc519t9c2wwsz9yx9imziqs8jh1hcs74wf396ytzwt'
                                        onInit={(evt, editor) => editorRef.current = editor}
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar: 'undo redo | formatselect | ' +
                                                'bold italic backcolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }}
                                        onEditorChange={handleEditChange}
                                    />
                                    {formik.touched.content && formik.errors.content ? (
                                        <div className='text-danger'>{formik.errors.content}</div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className='row' style={{ justifyContent: 'center' }}>
                            <div className='col-md-12'>
                                <div className="form-group">
                                    <p>Status</p>
                                    <Radio.Group onChange={formik.handleChange} name="status">
                                        <Radio value={0}>Pending</Radio>
                                        <Radio value={1}>Public</Radio>
                                    </Radio.Group>
                                    {formik.touched.status && formik.errors.status ? (
                                        <div className='text-danger'>{formik.errors.status}</div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className="pb-2">
                            <button type="submit" className="btn btn-dark w-100 font-weight-bold mt-2">Submit</button>
                        </div>
                    </form>
                </div>
                <nav aria-label="Page navigation example">
                </nav>
            </div>
        </div>
    )
}
