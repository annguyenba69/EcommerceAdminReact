import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2';
import { history } from '../../App';
import { slideService } from '../../services/SlideService';
import { STATUS_CODE } from '../../utils/configSystem';
import { openNotificationWithIcon } from '../../utils/notification';
import { setDisplayLoadingAction, setHiddenLoadingAction } from './LoadingReducer';

const initialState = {
    listSlides : [],
    num: {
        numSlide: 0,
        numTrashedSlide: 0
    }
}

const SlideReducer = createSlice({
  name: "SlideReducer",
  initialState,
  reducers: {
    setListSlidesAction : (state, action)=>{
        state.listSlides = action.payload.listSlides;
        state.num.numSlide = action.payload.numSlide
        state.num.numTrashedSlide = action.payload.numTrashedSlide
    }
  }
});

export const {setListSlidesAction} = SlideReducer.actions

export default SlideReducer.reducer

//=========================Action Thunk================================
export const getAllSlides = (status) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction())
            const result = await slideService.getAllSlides(status)
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(setListSlidesAction(result.data.content));
                await dispatch(setHiddenLoadingAction());
            }
        } catch (err) {
            openNotificationWithIcon('error', 'Error', 'Error');
            console.log(err)
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const addSlide = (model) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction())
            const result = await slideService.addSlide(model)
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllSlides());
                await dispatch(setHiddenLoadingAction());
                history.push('/admin/slide/list-slide');
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            openNotificationWithIcon('error', 'Error', 'Error');
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const changeStatusSlide = (id) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction())
            const result = await slideService.changeStatusSlide(id)
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllSlides());
                await dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            openNotificationWithIcon('error', 'Error', 'Error');
            dispatch(setHiddenLoadingAction());
            console.log(err)
        }
    }
}

export const softDeleteSlide = (id) => {
    return async (dispatch) => {
        try {
            const result = await slideService.softDeleteSlide(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                Swal.fire(
                    'Deleted!',
                    `${result.data.message}`,
                    'success'
                )
                await dispatch(getAllSlides());
            }
        } catch (err) {
            console.log(err);
        }

    }
}

export const confirmSoftDeleteSlide = (id) => {
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
                dispatch(softDeleteSlide(id))
            }
        });
    }
}

export const forceDeleteSlide = (id) => {
    return async (dispatch) => {
        try {
            const result = await slideService.forceDeleteSlide(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                Swal.fire(
                    'Deleted!',
                    `${result.data.message}`,
                    'success'
                )
                await dispatch(getAllSlides("trash"));
            }
        } catch (err) {
            console.log(err);
        }

    }
}

export const confirmForceDeleteSlide = (id) => {
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
                dispatch(forceDeleteSlide(id))
            }
        });
    }
}

export const restoreSlide = (id) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction())
            const result = await slideService.restoreSlide(id)
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllSlides('trash'));
                await dispatch(setHiddenLoadingAction());
            }
        } catch (err) {
            openNotificationWithIcon('error', 'Error', 'Error');
            console.log(err)
            dispatch(setHiddenLoadingAction());
        }
    }
}
