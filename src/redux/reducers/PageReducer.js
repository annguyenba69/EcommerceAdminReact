import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2';
import { history } from '../../App';
import { pageService } from '../../services/PageService';
import { STATUS_CODE } from '../../utils/configSystem';
import { openNotificationWithIcon } from '../../utils/notification';
import { setDisplayLoadingAction, setHiddenLoadingAction } from './LoadingReducer';

const initialState = {
    listPages : [],
    num: {
        numPages: 0,
        numTrashPages: 0
    },
    detailPage: {}
}

const PageReducer = createSlice({
  name: "PageReducer",
  initialState,
  reducers: {
    setListPagesAction : (state, action)=>{
        state.listPages = action.payload.pages;
        state.num.numPages = action.payload.numPages;
        state.num.numTrashPages = action.payload.numTrashPages;
    },
    setDetailPageAction : (state, action)=>{
        state.detailPage = action.payload
    }
  }
});

export const {setListPagesAction, setDetailPageAction} = PageReducer.actions

export default PageReducer.reducer
//===================Action Thunk===========================

export const getAllListPages = (status, keyword) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await pageService.getAllListPages(status, keyword);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(setListPagesAction(result.data.content));
                dispatch(setHiddenLoadingAction());
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const softDeletePage = (id) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await pageService.softDeletePage(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllListPages());
                dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const confirmSoftDeletePage = (id) => {
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
                dispatch(softDeletePage(id))
            }
        });
    }
}

export const restorePage = (id) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await pageService.restorePage(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllListPages("trash"));
                dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const forceDeletePage = (id) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await pageService.forceDeletePage(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllListPages("trash"));
                dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const confirmForceDeletePage = (id) => {
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
                dispatch(forceDeletePage(id))
            }
        });
    }
}

export const getDetailPage = (id) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await pageService.getDetailPage(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                dispatch(setDetailPageAction(result.data.content));
                dispatch(setHiddenLoadingAction());
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const addPage = (model)=>{
    return async (dispatch)=>{
        try{
            dispatch(setDisplayLoadingAction());
            const result = await pageService.addPage(model);
            console.log(result);
            if(result.status === STATUS_CODE.SUCCESS){
                dispatch(getAllListPages());
                dispatch(setHiddenLoadingAction());
                history.push('/admin/page/list-page');
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        }catch(err){
            console.log(err);
        }
    }
}