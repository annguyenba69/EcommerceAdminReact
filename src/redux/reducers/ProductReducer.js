import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2';
import { history } from '../../App';
import { productService } from '../../services/ProductService';
import { STATUS_CODE } from '../../utils/configSystem';
import { openNotificationWithIcon } from '../../utils/notification';
import { setVisibleFalseAction } from './DrawerReducer';
import { setDisplayLoadingAction, setHiddenLoadingAction } from './LoadingReducer';

const initialState = {
    allListProducts: [],
    detailProduct: {},
    numberProduct: {
        numberActiveProducts: 0,
        numberTrashProducts:  0
    }
}

const ProductReducer = createSlice({
    name: "ProductReducer",
    initialState,
    reducers: {
        setAllListProductsAction: (state, action) => {
            state.allListProducts = action.payload.listProducts;
            state.numberProduct.numberActiveProducts = action.payload.numberActiveProducts;
            state.numberProduct.numberTrashProducts = action.payload.numberTrashProducts;
        },
        setDetailProductAction : (state, action)=>{
            state.detailProduct = action.payload
        }
    }
});

export const { setAllListProductsAction, setDetailProductAction } = ProductReducer.actions

export default ProductReducer.reducer
//======================Action Thunk==================================

export const getAllListProducts = (status, keyword) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await productService.getAllProducts(status, keyword);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(setAllListProductsAction(result.data.content));
                await dispatch(setHiddenLoadingAction());
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const addProduct = (model) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await productService.addProduct(model);
            if (result.status === STATUS_CODE.SUCCESS) {
                console.log(result)
                await dispatch(getAllListProducts());
                await dispatch(setHiddenLoadingAction());
                history.push('/admin/product/list-product');
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            console.log(err);
            await dispatch(setHiddenLoadingAction());
        }
    }
}

export const softDeleteProduct = (id) => {
    return async (dispatch) => {
        try {
            const result = await productService.softDeleteProduct(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                Swal.fire(
                    'Deleted!',
                    `${result.data.message}`,
                    'success'
                )
                await dispatch(getAllListProducts(""));
            }
        } catch (err) {
            console.log(err);
        }

    }
}

export const confirmSoftDeleteProduct = (id) => {
    return async (dispatch) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will delete it temporarily, which can be restored in the recycle bin!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(softDeleteProduct(id))
            }
        });
    }
}

export const forceDeleteProduct = (id) => {
    return async (dispatch) => {
        try {
            const result = await productService.forceDeleteProduct(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                Swal.fire(
                    'Deleted!',
                    `${result.data.message}`,
                    'success'
                )
                await dispatch(getAllListProducts("trash"));
            }
        } catch (err) {
            console.log(err);
        }

    }
}

export const confirmForceDeleteProduct = (id) => {
    return async (dispatch) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(forceDeleteProduct(id))
            }
        });
    }
}

export const restoreProduct = (id) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await productService.restoreProduct(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllListProducts('trash'));
                await dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            console.log(err);
            dispatch(setDisplayLoadingAction());
        }
    }
}

export const getDetailProduct = (id)=>{
    return async (dispatch)=>{
        try{
            dispatch(setDisplayLoadingAction());
            const result = await productService.getDetailProduct(id);
            if(result.status === STATUS_CODE.SUCCESS){
                await dispatch(setDetailProductAction(result.data.content));
                await dispatch(setHiddenLoadingAction());
            }
        }catch(err){
            console.log(err);
            dispatch(setDisplayLoadingAction());
        }
    }
}

export const editProduct = (model)=>{
    return async (dispatch)=>{
        try{
            dispatch(setDisplayLoadingAction());
            const result = await productService.editProduct(model);
            if(result.status === STATUS_CODE.SUCCESS){
                await dispatch(getAllListProducts());
                await dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        }catch(err){
            console.log(err);
            await dispatch(getAllListProducts());
            await dispatch(setHiddenLoadingAction());
            openNotificationWithIcon('error', 'error', err.response.data.message);
        }
    }
}