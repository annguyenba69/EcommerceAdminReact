import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2';
import { history } from '../../App';
import { postService } from '../../services/PostService';
import { STATUS_CODE } from '../../utils/configSystem';
import { openNotificationWithIcon } from '../../utils/notification';
import { setDisplayLoadingAction, setHiddenLoadingAction } from './LoadingReducer';

const initialState = {
    allListPosts: [],
    detailPost: {},
    numberPosts: {
        numberActivePosts: 0,
        numberTrashPosts: 0
    },

}

const PostReducer = createSlice({
    name: 'PostReducer',
    initialState,
    reducers: {
        setAllListPostsAction: (state, action) => {
            state.allListPosts = action.payload.posts;
            state.numberPosts.numberActivePosts = action.payload.numberActivePosts;
            state.numberPosts.numberTrashPosts = action.payload.numberTrashPosts
        },
        setDetailPostAction: (state, action) => {
            state.detailPost = action.payload;
        }
    }
});

export const { setAllListPostsAction, setDetailPostAction } = PostReducer.actions

export default PostReducer.reducer
//===================Action Thunk===========================

export const getAllPosts = (status, keyword) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await postService.getAllPosts(status, keyword);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(setAllListPostsAction(result.data.content));
                dispatch(setHiddenLoadingAction());
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const softDeletePost = (id) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await postService.softDeletePost(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllPosts());
                dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const confirmSoftDeletePost = (id) => {
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
                dispatch(softDeletePost(id))
            }
        });
    }
}

export const restorePost = (id) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await postService.restorePost(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllPosts("trash"));
                dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const forceDeletePost = (id) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await postService.forceDeletePost(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllPosts("trash"));
                dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const confirmForceDeletePost = (id) => {
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
                dispatch(forceDeletePost(id))
            }
        });
    }
}

export const getDetailPost = (id) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await postService.getDetailPost(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                dispatch(setDetailPostAction(result.data.content));
                dispatch(setHiddenLoadingAction());
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const addPost = (model)=>{
    return async (dispatch)=>{
        try{
            dispatch(setDisplayLoadingAction());
            const result = await postService.addPost(model);
            if(result.status === STATUS_CODE.SUCCESS){
                dispatch(getAllPosts());
                dispatch(setHiddenLoadingAction());
                history.push('/admin/post/list-post');
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        }catch(err){
            console.log(err);
        }
    }
}
