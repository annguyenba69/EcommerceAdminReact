import React, { useRef, useState } from 'react'
import { UserOutlined, DollarOutlined } from '@ant-design/icons';
import { Button, Col, Image, Input, Modal, Radio, Row, Select, Upload, } from 'antd';
import { useFormik } from 'formik';
import { setVisibleFalseAction } from '../../../redux/reducers/DrawerReducer';
import { useDispatch, useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import { useEffect } from 'react';
import { getAllListActiveProductCats } from '../../../redux/reducers/ProductCatReducer';
import { DOMAIN } from '../../../utils/configSystem';
import { editProduct, getDetailProduct } from '../../../redux/reducers/ProductReducer';
import { PlusOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { getDetailPost } from '../../../redux/reducers/PostReducer';
import { editPost, getAllListActivePostCat, getAllListPostCat } from '../../../redux/reducers/PostCatReducer';
const { Option } = Select;
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);

        reader.onerror = (error) => reject(error);
    });
export default function AdminEditPost() {
    let { id } = useParams();
    const { detailPost } = useSelector(state => state.PostReducer);
    const { allListPostCats } = useSelector(state => state.PostCatReducer);
    const dispatch = useDispatch();
    const editorRef = useRef(null);
    const [imgSrc, setImgSrc] = useState("");
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: detailPost?.id,
            title: detailPost?.title,
            content: detailPost?.content,
            status: detailPost?.status,
            post_cat_id: detailPost.post_categories?.[0].id,
            file: null,
            fileName: detailPost?.thumbnail
        },
        onSubmit: values => {
            let formData = new FormData();
            for (let key in values) {
                if (key !== 'file' && key !== 'fileName') {
                    formData.append(key, values[key]);
                } else if (key !== 'fileName') {
                    if (values.file !== null) {
                        formData.append("file", values.file);
                    }
                }
            }
            dispatch(editPost(formData)); //formData
        },
    });
    const handleChangePostCat = (value) => {
        formik.setFieldValue("post_cat_id", value);
    };

    const handleEditChange = () => {
        if (editorRef.current) {
            formik.setFieldValue('content', editorRef.current.getContent());
        }
    }

    const renderOptions = () => {
        return allListPostCats?.map((postCat, index) => {
            return <Option key={index} value={postCat.id}>{"---/".repeat(postCat.level) + postCat.name}</Option>
        })
    }
    const renderImage = () => {
        if (imgSrc !== "") {
            return <Image width={150} src={imgSrc} />
        } else {
            return <Image className='mr-2 mt-2' width={150} src={DOMAIN + formik.values.fileName} />
        }
    }

    const onChangeFile = (event) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            setImgSrc(event.target.result);
        }
        formik.setFieldValue('file', file);
    }
    useEffect(() => {
        dispatch(getAllListPostCat());
        dispatch(getDetailPost(id));
    }, []);
    return (
        <div className="card">
            <div className="card-header font-weight-bold d-flex  align-items-center">
                <h5 className="m-0 ">Edit Post</h5>
            </div>
            <div className="card-body">
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className="form-group">
                                    <Input value={formik.values.title} onChange={formik.handleChange} name='title' size="large" placeholder="Title" prefix={<UserOutlined />} style={{ fontSize: '20px' }} />
                                    {formik.touched.title && formik.errors.title ? (
                                        <div className='text-danger'>{formik.errors.title}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className='col-md-12'>
                                <div className="form-group">
                                    <Editor
                                        apiKey='mxc67ijc519t9c2wwsz9yx9imziqs8jh1hcs74wf396ytzwt'
                                        onInit={(evt, editor) => editorRef.current = editor}
                                        value={formik.values.content}
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
                                    {formik.touched.description && formik.errors.description ? (
                                        <div className='text-danger'>{formik.errors.description}</div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className='row' style={{ justifyContent: 'center' }}>
                            <div className='col-md-12'>
                                <div className="form-group">
                                    <p>Status</p>
                                    <Radio.Group onChange={formik.handleChange} name="status" value={parseInt(formik.values.status)}>
                                        <Radio value={0}>Pending</Radio>
                                        <Radio value={1}>Public</Radio>
                                    </Radio.Group>
                                    {formik.touched.status && formik.errors.status ? (
                                        <div className='text-danger'>{formik.errors.status}</div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className='form-group'>
                            <Select
                                placeholder="Select Post Category"
                                size='large'
                                style={{ width: '100%' }}
                                onChange={handleChangePostCat}
                                value={formik.values.post_cat_id}
                            >
                                {renderOptions()}
                            </Select>
                            {formik.touched.product_cat_id && formik.errors.product_cat_id ? (
                                <div className='text-danger'>{formik.errors.product_cat_id}</div>
                            ) : null}
                        </div>
                        <div className='form-group'>
                            <p className='font-weight-bold'>Images</p>
                            <input onChange={onChangeFile} type="file" accept="image/png, image/jpeg, image/jpg" />
                            <div>
                                {renderImage()}
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
