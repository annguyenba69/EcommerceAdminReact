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
const { Option } = Select;
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);

        reader.onerror = (error) => reject(error);
    });
export default function AdminEditProduct() {
    let { id } = useParams();
    const { detailProduct } = useSelector(state => state.ProductReducer);
    const { allListActiveProductCats } = useSelector(state => state.ProductCatReducer);
    const dispatch = useDispatch();
    const editorRefDescription = useRef(null);
    const editorRef = useRef(null);
    const [imgSrc, setImgSrc] = useState([]);
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: detailProduct?.id,
            name: detailProduct?.name,
            price: detailProduct?.price,
            description: detailProduct?.description,
            detail: detailProduct?.detail,
            status_public: detailProduct?.status_public,
            status_feature: detailProduct?.status_feature,
            status_warehouse: detailProduct?.status_warehouse,
            product_cat_id: detailProduct.product_parent_category?.[0].id,
            files: null,
            fileName: detailProduct?.product_thumbnails
        },
        onSubmit: values => {
            console.log(values)
            let formData = new FormData();
            for (let key in values) {
                if (key !== 'files' && key !== 'fileName') {
                    formData.append(key, values[key]);
                } else if (key !== 'fileName') {
                    if (values.files !== null) {
                        for (let i = 0; i < values.files.length; i++) {
                            formData.append("files[]", values.files[i]);
                        }
                    }
                }
            }
            for (var pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }
            dispatch(editProduct(formData)); //formData
        },
    });
    const handleChangeProductCategory = (value) => {
        formik.setFieldValue("product_cat_id", value);
    };
    const handleEditorDescriptionChange = () => {
        if (editorRefDescription.current) {
            formik.setFieldValue('description', editorRefDescription.current.getContent());
        }
    };
    const handleEditorDetailChange = () => {
        if (editorRef.current) {
            formik.setFieldValue('detail', editorRef.current.getContent());
        }
    }
    const renderOptions = () => {
        return allListActiveProductCats?.map((productCat, index) => {
            return <Option key={index} value={productCat.id}>{"---/".repeat(productCat.level) + productCat.name}</Option>
        })
    }
    const renderImage = () => {
        if (imgSrc.length !== 0) {
            return imgSrc.map((thumbnail, index) => {
                return <Image key={index} width={150} src={thumbnail} />
            })
        } else {
            return formik.values.fileName?.map((thumbnail, index) => {
                return <Image className='mr-2 mt-2' key={index} width={150} src={DOMAIN + thumbnail.thumbnail} />
            })
        }
    }

    const onChangeFile = (event) => {
        const imagesArray = [];
        const imagesBase64 = [];
        for (let i = 0; i < event.target.files.length; i++) {
            let reader = new FileReader();
            reader.readAsDataURL(event.target.files[i]);
            reader.onload = (event) => {
                imagesBase64.push(event.target.result);
                setImgSrc(imagesBase64);
            }
            imagesArray.push(event.target.files[i]);
        }
        formik.setFieldValue('files', imagesArray);
    }
    useEffect(() => {
        dispatch(getAllListActiveProductCats());
        dispatch(getDetailProduct(id));
    }, []);
    return (
        <div className="card">
            <div className="card-header font-weight-bold d-flex  align-items-center">
                <h5 className="m-0 ">Add Product</h5>
            </div>
            <div className="card-body">
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className='row'>
                            <div className='col-md-6'>
                                <div className="form-group">
                                    <Input value={formik.values.name} onChange={formik.handleChange} name='name' size="large" placeholder="Name" prefix={<UserOutlined />} style={{ fontSize: '20px' }} />
                                    {formik.touched.name && formik.errors.name ? (
                                        <div className='text-danger'>{formik.errors.name}</div>
                                    ) : null}
                                </div>
                                <div className="form-group">
                                    <Input value={formik.values.price} onChange={formik.handleChange} name='price' size="large" placeholder="Price" prefix={<DollarOutlined />} style={{ fontSize: '20px' }} />
                                    {formik.touched.price && formik.errors.price ? (
                                        <div className='text-danger'>{formik.errors.price}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="form-group">
                                    <Editor
                                        apiKey='mxc67ijc519t9c2wwsz9yx9imziqs8jh1hcs74wf396ytzwt'
                                        onInit={(evt, editor) => editorRefDescription.current = editor}
                                        value={formik.values.description}
                                        init={{
                                            height: 200,
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
                                        onEditorChange={handleEditorDescriptionChange}
                                    />
                                    {formik.touched.description && formik.errors.description ? (
                                        <div className='text-danger'>{formik.errors.description}</div>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <Editor
                                apiKey='mxc67ijc519t9c2wwsz9yx9imziqs8jh1hcs74wf396ytzwt'
                                onInit={(evt, editor) => editorRef.current = editor}
                                value={formik.values.detail}
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
                                onEditorChange={handleEditorDetailChange}
                            />
                            {formik.touched.detail && formik.errors.detail ? (
                                <div className='text-danger'>{formik.errors.detail}</div>
                            ) : null}
                        </div>
                        <div className='row' style={{ justifyContent: 'center' }}>
                            <div className='col-md-4'>
                                <div className="form-group text-center">
                                    <p>Status Public</p>
                                    <Radio.Group onChange={formik.handleChange} name="status_public" value={parseInt(formik.values.status_public)}>
                                        <Radio value={0}>Pending</Radio>
                                        <Radio value={1}>Public</Radio>
                                    </Radio.Group>
                                    {formik.touched.status_public && formik.errors.status_public ? (
                                        <div className='text-danger'>{formik.errors.status_public}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className="form-group text-center">
                                    <p>Status Feature</p>
                                    <Radio.Group onChange={formik.handleChange} name="status_feature" value={parseInt(formik.values.status_feature)}>
                                        <Radio value={0}>No</Radio>
                                        <Radio value={1}>Yes</Radio>
                                    </Radio.Group>
                                    {formik.touched.status_feature && formik.errors.status_feature ? (
                                        <div className='text-danger'>{formik.errors.status_feature}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className="form-group text-center">
                                    <p>Status Warehouse</p>
                                    <Radio.Group onChange={formik.handleChange} name="status_warehouse" value={parseInt(formik.values.status_warehouse)}>
                                        <Radio value={0}>Out of Stock</Radio>
                                        <Radio value={1}>Stocking</Radio>
                                    </Radio.Group>
                                    {formik.touched.status_warehouse && formik.errors.status_warehouse ? (
                                        <div className='text-danger'>{formik.errors.status_warehouse}</div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className='form-group'>
                            <Select
                                placeholder="Select Product Category"
                                size='large'
                                style={{ width: '100%' }}
                                onChange={handleChangeProductCategory}
                                value={formik.values.product_cat_id}
                            >
                                {renderOptions()}
                            </Select>
                            {formik.touched.product_cat_id && formik.errors.product_cat_id ? (
                                <div className='text-danger'>{formik.errors.product_cat_id}</div>
                            ) : null}
                        </div>
                        <div className='form-group'>
                            <p className='font-weight-bold'>Images</p>
                            <input onChange={onChangeFile} multiple type="file" accept="image/png, image/jpeg, image/jpg" />
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
