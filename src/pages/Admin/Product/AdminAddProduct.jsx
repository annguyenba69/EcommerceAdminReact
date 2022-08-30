import { Input, Select, Switch, Modal, Upload, Radio, Button, Image } from 'antd';
import { useFormik } from 'formik';
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { UserOutlined, MediumOutlined, CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import { useEffect } from 'react';
import { getAllListActiveProductCats } from '../../../redux/reducers/ProductCatReducer';
import { addProduct } from '../../../redux/reducers/ProductReducer';
const { Option } = Select;
export default function AdminAddProduct() {
    const editorRef = useRef(null);
    const editorRefDescription = useRef(null);
    const dispatch = useDispatch();
    const { allListActiveProductCats } = useSelector(state => state.ProductCatReducer);
    const [imgSrc, setImgSrc] = useState([]);
    const formik = useFormik({
        initialValues: {
            name: '',
            price: '',
            description: '',
            detail: '',
            status_public: 0,
            status_feature: 0,
            status_warehouse: 0,
            product_cat_id: '',
            files: []
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Name field is required'),
            price: Yup.number()
                .required('Price field is required'),
            description: Yup.string()
                .required('Description field is required'),
            detail: Yup.string()
                .required('Detail field is required'),
            status_public: Yup.number()
                .required('Status Public field is required'),
            status_feature: Yup.number()
                .required('Status Feature field is required'),
            status_warehouse: Yup.number()
                .required('Status Warehouse field is required'),
            product_cat_id: Yup.number()
                .required('Product Category field is required'),
        }),
        onSubmit: values => {
            let formData = new FormData();
            for (let key in values) {
                if (key !== 'files') {
                    formData.append(key, values[key]);
                } else {
                    for (let i = 0; i < values.files.length; i++) {
                        formData.append("files[]", values.files[i]);
                    }
                }
            }
            dispatch(addProduct(formData));
        },
    });
    const handleChangeProductCategory = (value) => {
        formik.setFieldValue("product_cat_id", value);
    };

    const handleEditorChange = () => {
        if (editorRef.current) {
            formik.setFieldValue('detail', editorRef.current.getContent());
        }
    };

    const handleEditorDescriptionChange = () => {
        if (editorRefDescription.current) {
            formik.setFieldValue('description', editorRefDescription.current.getContent());
        }
    };

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
            }
            imagesArray.push(event.target.files[i]);
        }
        setImgSrc(imagesBase64);
        formik.setFieldValue('files', imagesArray);
    }

    useEffect(() => {
        dispatch(getAllListActiveProductCats());
    }, [imgSrc]);
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
                                    <Input onChange={formik.handleChange} name='name' size="large" placeholder="Name" prefix={<UserOutlined />} style={{ fontSize: '20px' }} />
                                    {formik.touched.name && formik.errors.name ? (
                                        <div className='text-danger'>{formik.errors.name}</div>
                                    ) : null}
                                </div>
                                <div className="form-group">
                                    <Input onChange={formik.handleChange} name='price' size="large" placeholder="Price" prefix={<MediumOutlined />} style={{ fontSize: '20px' }} />
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
                                        initialValue="<p>Description</p>"
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
                                initialValue="<p>Detail</p>"
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
                                onEditorChange={handleEditorChange}
                            />
                            {formik.touched.detail && formik.errors.detail ? (
                                <div className='text-danger'>{formik.errors.detail}</div>
                            ) : null}
                        </div>
                        <div className='row' style={{ justifyContent: 'center' }}>
                            <div className='col-md-4'>
                                <div className="form-group text-center">
                                    <p>Status Public</p>
                                    <Radio.Group onChange={formik.handleChange} name="status_public" defaultValue={0}>
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
                                    <Radio.Group onChange={formik.handleChange} name="status_feature" defaultValue={0}>
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
                                    <Radio.Group onChange={formik.handleChange} name="status_warehouse" defaultValue={0}>
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
                            >
                                {renderOptions()}
                            </Select>
                            {formik.touched.product_cat_id && formik.errors.product_cat_id ? (
                                <div className='text-danger'>{formik.errors.product_cat_id}</div>
                            ) : null}
                        </div>
                        <div className='form-group'>
                            <input onChange={onChangeFile} multiple type="file" accept="image/png, image/jpeg, image/jpg" />
                            {renderImage()}
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
