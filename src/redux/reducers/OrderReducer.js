import { createSlice } from '@reduxjs/toolkit'
import { orderService } from '../../services/OrderService';
import { STATUS_CODE } from '../../utils/configSystem';
import { openNotificationWithIcon } from '../../utils/notification';
import { setVisibleFalseAction } from './DrawerReducer';
import { setDisplayLoadingAction, setHiddenLoadingAction } from './LoadingReducer';

const initialState = {
    listOrders : [],
    num: "",
    detailOrder: {}
}

const OrderReducer = createSlice({
  name: "OrderReducer",
  initialState,
  reducers: {
    setListOrdersAction: (state, action)=>{
        state.listOrders = action.payload.listOrders;
        state.num = action.payload.num
    },
    setDetailOrder: (state, action)=>{
        state.detailOrder = action.payload;
    }
  }
});

export const {setListOrdersAction, setDetailOrder} = OrderReducer.actions

export default OrderReducer.reducer

//====================Action Thunk======================

export const getAllOrders = (order_status_id, keyword)=>{
    return async (dispatch)=>{
        try{
            dispatch(setDisplayLoadingAction());
            const result = await orderService.getAllOrders(order_status_id, keyword);
            if(result.status === STATUS_CODE.SUCCESS){
                dispatch(setListOrdersAction(result.data.content));
                dispatch(setHiddenLoadingAction());
            }
        }catch(err){
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const getDetailOrder = (id)=>{
    return async (dispatch)=>{
        try{
            dispatch(setDisplayLoadingAction());
            const result = await orderService.getDetailOrder(id);
            if(result.status === STATUS_CODE.SUCCESS){
                dispatch(setDetailOrder(result.data.content));
                dispatch(setHiddenLoadingAction());
            }
        }catch(err){
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}

export const editOrder = (model)=>{
    return async (dispatch)=>{
        try{
            dispatch(setDisplayLoadingAction());
            const result = await orderService.editOrder(model);
            if(result.status === STATUS_CODE.SUCCESS){
                dispatch(getAllOrders());
                dispatch(setHiddenLoadingAction())
                dispatch(setVisibleFalseAction());
                openNotificationWithIcon('success', 'Success', result.data.message);
            }
        }catch(err){
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}