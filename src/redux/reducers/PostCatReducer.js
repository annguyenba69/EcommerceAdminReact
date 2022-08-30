import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2';
import { history } from '../../App';
import { postService } from '../../services/PostService';
import { STATUS_CODE } from '../../utils/configSystem';
import { openNotificationWithIcon } from '../../utils/notification';
import { setVisibleFalseAction } from './DrawerReducer';
import { setDisplayLoadingAction, setHiddenLoadingAction } from './LoadingReducer';

const initialState = {
    allListPostCats: [],
    detailPostCat: {},
    allListActivePostCats: []
}

const PostCatReducer = createSlice({
    name: "PostCatReducer",
    initialState,
    reducers: {
        setAllListPostCatsAction: (state, action) => {
            state.allListPostCats = action.payload;
        },
        setDetailPostCat: (state, action) => {
            state.detailPostCat = action.payload;
        },
        setAllListActivePostCats : (state, action)=>{
            state.allListActivePostCats = action.payload;
        }
    }
});

export const { setAllListPostCatsAction, setDetailPostCat, setAllListActivePostCats } = PostCatReducer.actions

export default PostCatReducer.reducer
//========================Action Thunk=========================
export const getAllListPostCat = (keyword) => {
    return async (dispatch) => {
        try {
            await dispatch(setDisplayLoadingAction());
            const result = await postService.getAllListPostCat(keyword);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(setAllListPostCatsAction(result.data.content));
                await dispatch(setHiddenLoadingAction());
            }
        } catch (err) {
            console.log(err);
            await dispatch(setHiddenLoadingAction());
        }
    }
}

export const getDetailPostCatById = (id) => {
    return async (dispatch) => {
        try {
            await dispatch(setDisplayLoadingAction());
            const result = await postService.getDetailPostCatById(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(setDetailPostCat(result.data.content));
                await dispatch(setHiddenLoadingAction());
            }
        } catch (err) {
            console.log(err);
            await dispatch(setHiddenLoadingAction());
        }
    }
}

export const addPostCat = (model) => {
    return async (dispatch) => {
        try {
            await dispatch(setDisplayLoadingAction());
            const result = await postService.addPostCat(model);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllListPostCat());
                await dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            console.log(err);
            await dispatch(setHiddenLoadingAction());
        }
    }
}

export const editPostCat = (model) => {
    return async (dispatch) => {
        try {
            await dispatch(setDisplayLoadingAction());
            const result = await postService.editPostCat(model);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllListPostCat());
                await dispatch(setVisibleFalseAction());
                await dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            console.log(err);
            await dispatch(getAllListPostCat());
            await dispatch(setVisibleFalseAction());
            await dispatch(setHiddenLoadingAction());
            openNotificationWithIcon('error', 'Error', err.response.data.message);
        }
    }
}

export const deletePostCat = (id) => {
    return async (dispatch) => {
        try {
            const result = await postService.deletePostCat(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                Swal.fire(
                    'Deleted!',
                    `${result.data.message}`,
                    'success'
                )
            }
            await dispatch(getAllListPostCat());
        } catch (err) {
            openNotificationWithIcon('error', 'Error', err.response.data.message);
        }
    }
}

export const confirmDeletePostCat = (id) => {
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
                dispatch(deletePostCat(id));
            }
        })
    }
}

export const editPost = (model)=>{
    return async (dispatch)=>{
        try{
            dispatch(setDisplayLoadingAction());
            const result = await postService.editPost(model);
            if( result.status === STATUS_CODE.SUCCESS){
                dispatch(setHiddenLoadingAction());
                history.push('/admin/post/list-post');
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        }catch(err){
            console.log(err);
        }
    }
}

export const getAllListActivePostCat = () =>{
    return async (dispatch)=>{
        try{
            const result = await postService.getAllListActivePostCat();
            if( result.status === STATUS_CODE.SUCCESS){
                dispatch(setAllListActivePostCats(result.data.content));
            }
        }catch(err){
            console.log(err);
        }
    }
}
