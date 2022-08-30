import { createSlice } from '@reduxjs/toolkit'
import { Navigate } from 'react-router-dom';
import { history } from '../../App';
import { userService } from '../../services/UserService';
import { STATUS_CODE, USER_LOGIN } from '../../utils/configSystem';
import { openNotificationWithIcon } from '../../utils/notification';
import { setVisibleFalseAction } from './DrawerReducer';
import { setDisplayLoadingAction, setHiddenLoadingAction } from './LoadingReducer';
import Swal from 'sweetalert2'

let getUserLogin = {};
if (localStorage.getItem(USER_LOGIN)) {
    getUserLogin = JSON.parse(localStorage.getItem(USER_LOGIN));
}

const initialState = {
    userLogin: getUserLogin,
    verifyEmailMessage: "",
    allListUsers: [],
    numberUser: {
        numberActiveUsers: 0,
        numberTrashUsers: 0
    },
    detailUser: {}
}

const UserReducer = createSlice({
    name: 'UserReducer',
    initialState,
    reducers: {
        setUserLoginAction: (state, action) => {
            state.userLogin = action.payload;
        },
        verifyEmailAction: (state, action) => {
            state.verifyEmailMessage = action.payload
        },
        setAllListUsers: (state, action) => {
            state.allListUsers = action.payload
        },
        setNumberUser: (state, action)=>{
            state.numberUser.numberActiveUsers = action.payload.numberActiveUsers;
            state.numberUser.numberTrashUsers = action.payload.numberTrashUsers;
        },
        setDetailUserAction: (state, action) => {
            state.detailUser = action.payload
        }
    },
});

export const { setUserLoginAction, verifyEmailAction, setAllListUsers, setDetailUserAction, setNumberUser } = UserReducer.actions
export default UserReducer.reducer
//=========================Action Thunk================================
export const getAllListUsers = ($status) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction())
            const result = await userService.getAllListUsers($status);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(setAllListUsers(result.data.content.listUsers));
                await dispatch(setNumberUser(result.data.content));
                await dispatch(setHiddenLoadingAction());
            }
        } catch (err) {
            openNotificationWithIcon('error', 'Error', 'Error');
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const register = (model) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction())
            const result = await userService.register(model);
            if (result.status === STATUS_CODE.SUCCESS) {
                localStorage.setItem('TOKEN', result.data.content);
                dispatch(setHiddenLoadingAction());
                history.push('/verification-notification');
                openNotificationWithIcon('success', 'Success', 'Successful Account Registration')
            }
        } catch (err) {
            dispatch(setHiddenLoadingAction())
        }
    }
}

export const login = (model) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction())
            const result = await userService.login(model);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(setUserLoginAction(result.data.content));
                localStorage.setItem("USER_LOGIN", JSON.stringify(result.data.content));
                localStorage.setItem('TOKEN', result.data.content.token);
                await dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
                history.push('/admin/user/list-user');
            }
        } catch (err) {
            dispatch(setHiddenLoadingAction())
            openNotificationWithIcon('error', 'Error', err.response.data.message);
        }
    }
}

export const verifyEmail = (id, hash) => {
    return async (dispatch) => {
        const promise = userService.verifyEmail(id, hash);
        promise.then((result) => {
            if (result.status === STATUS_CODE.SUCCESS) {
                dispatch(verifyEmailAction(result.data.message));
            }
        })
        promise.catch((err) => {
            dispatch(verifyEmailAction("Authentication link is not correct"));
        })
    }
}

export const addUser = (model) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction())
            const result = await userService.addUser(model);
            if (result.status === STATUS_CODE.SUCCESS) {
                dispatch(setHiddenLoadingAction());
                history.push('/admin/user/list-user');
                openNotificationWithIcon('success', 'Success', 'Account Added Successfully');
            }
        } catch (err) {
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const detailUser = (id) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction())
            const result = await userService.getDetailUserById(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                dispatch(setDetailUserAction(result.data.content));
                dispatch(setHiddenLoadingAction());
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const editUser = (model) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await userService.editUser(model);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllListUsers());
                await dispatch(setHiddenLoadingAction());
                await dispatch(setVisibleFalseAction());
                openNotificationWithIcon('success', 'Success', 'Account Edited Successfully');
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const softDeleteUser = (id) => {
    return async (dispatch) => {
        try {
            const result = await userService.softDeleteUser(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                Swal.fire(
                    'Deleted!',
                    `${result.data.message}`,
                    'success'
                )
            }
            await dispatch(getAllListUsers());
        } catch (err) {
            console.log(err);
        }
    }
}


export const ConfirmDeleteUser = (id) => {
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
                dispatch(softDeleteUser(id));
            }
        })
    }
}

export const restoreUser = (id) => {
    return async (dispatch) => {
        try {
            dispatch(setDisplayLoadingAction());
            const result = await userService.restoreUser(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(getAllListUsers('trash'));
                dispatch(setHiddenLoadingAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        } catch (err) {
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const forceDeleteUser = (id) => {
    return async (dispatch) => {
        try {
            const result = await userService.forceDeleteUser(id);
            if (result.status === STATUS_CODE.SUCCESS) {
                Swal.fire(
                    'Deleted!',
                    `${result.data.message}`,
                    'success'
                )
            }
            await dispatch(getAllListUsers("trash"));
        } catch (err) {
            console.log(err);
        }
    }
}


export const ConfirmForceDeleteUser = (id) => {
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
                dispatch(forceDeleteUser(id));
            }
        })
    }
}

export const findUserByKeyword = (status, keyword) => {
    return async (dispatch) => {
        try {
            const result = await userService.findUserByKeyword(status,keyword);
            if (result.status === STATUS_CODE.SUCCESS) {
                await dispatch(setAllListUsers(result.data.content));
            }
        } catch (err) {
            console.log(err);
        }
    }
}