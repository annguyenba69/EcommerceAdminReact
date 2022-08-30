import { createSlice } from '@reduxjs/toolkit'
import { orderStatusService } from '../../services/OrderStatusService';
import { STATUS_CODE } from '../../utils/configSystem';

const initialState = {
    listOrderStatuses: []
}

const OrderStatusReducer = createSlice({
  name: "OrderStatusReducer",
  initialState,
  reducers: {
    setListOrderStatusesAction : (state, action)=>{
        state.listOrderStatuses = action.payload;
    }
  }
});

export const {setListOrderStatusesAction} = OrderStatusReducer.actions

export default OrderStatusReducer.reducer

export const getAllOrderStatus = ()=>{
    return async (dispatch)=>{
        try{
            const result = await orderStatusService.getAllOrderStatus();
            if(result.status=== STATUS_CODE.SUCCESS){
                dispatch(setListOrderStatusesAction(result.data.content));
            }
        }catch(err){
            console.log(err);
        }
    }
}