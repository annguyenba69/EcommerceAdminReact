import { createSlice } from '@reduxjs/toolkit'
import { productService } from '../../services/ProductService';
import { STATUS_CODE } from '../../utils/configSystem';
import { openNotificationWithIcon } from '../../utils/notification';
import { setVisibleFalseAction, setVisibleTrueAction } from './DrawerReducer';
import { setDisplayLoadingAction, setHiddenLoadingAction } from './LoadingReducer';
import Swal from 'sweetalert2'
const initialState = {
    allListProductCats: [],
    allListActiveProductCats: [],
    detailProductCat: {}
}

const ProductCatReducer = createSlice({
    name: "ProductCatReducer",
    initialState,
    reducers: {
        setAllListProductCatsAction: (state, action) => {
            state.allListProductCats = action.payload
        },
        setDetailProductCat: (state, action) => {
            state.detailProductCat = action.payload
        },
        setAllListActiveProductCatsAction : (state, action)=>{
            state.allListActiveProductCats = action.payload
        }
    }
});

export const { setAllListProductCatsAction, setDetailProductCat, setAllListActiveProductCatsAction } = ProductCatReducer.actions

export default ProductCatReducer.reducer

//=========================Action Thunk=====================

export const getAllListProductCats = (keyword) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await productService.getAllListProductCats(keyword);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(setAllListProductCatsAction(result.data.content));
                await dispatch(setHiddenLoadingAction);
            }
            dispatch(setHiddenLoadingAction());
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const getAllListActiveProductCats = () => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await productService.getAllListActiveProductCats();
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(setAllListActiveProductCatsAction(result.data.content));
                await dispatch(setHiddenLoadingAction);
            }
            dispatch(setHiddenLoadingAction());
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const addProductCat = (model) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await productService.addProductCat(model);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllListProductCats());
                await dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            console.log(err);
            await dispatch(setHiddenLoadingAction());
        }
    }
}

export const getDetailProductCatById = (id) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await productService.getDetailProductCatById(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(setDetailProductCat(result.data.content));
                await dispatch(setHiddenLoadingAction());
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const editProductCat = (model) => {
    return async (dispatch) => {
        try {
            // dispatch(setDisplayLoadingAction());
            const result = await productService.editProductCat(model);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllListProductCats());
                await dispatch(setVisibleFalseAction());
                await dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            await dispatch(getAllListProductCats());
            await dispatch(setVisibleFalseAction());
            await dispatch(setHiddenLoadingAction());
            openNotificationWithIcon('error', 'Error', err.response.data.message);
        }
    }
}


export const deleteProductCat = (id) => {
    return async (dispatch) => {
        try {
            const result = await productService.deleteProductCat(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                Swal.fire(
                    'Deleted!',
                    `${result.data.message}`,
                    'success'
                )
            }
            await dispatch(getAllListProductCats());
        } catch (err) {
            openNotificationWithIcon('error', 'Error', err.response.data.message);
        }
    }
}


export const confirmDeleteProductCat = (id) => {
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
                dispatch(deleteProductCat(id));
            }
        })
    }
}