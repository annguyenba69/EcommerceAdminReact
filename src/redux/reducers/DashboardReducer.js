import { createSlice } from '@reduxjs/toolkit'
import { dashboardService } from '../../services/DashboardService';
import { STATUS_CODE } from '../../utils/configSystem';
import { setDisplayLoadingAction, setHiddenLoadingAction } from './LoadingReducer';

const initialState = {
    infoDashboard: {
        latest: [],
        recentAddProducts: [],
        numberOrder: {
            pendingOrder: 0,
            deliveryOrder: 0,
            completeOrder: 0,
            cancelOrder: 0,
            totalRevenue: 0
        }
    }
}

const DashboardReducer = createSlice({
  name: "DashboardReducer",
  initialState,
  reducers: {
    setInfoDashboard: (state, action)=>{
        state.infoDashboard.latest = action.payload.latest;
        state.infoDashboard.recentAddProducts = action.payload.recentAddProducts;
        state.infoDashboard.numberOrder.pendingOrder = action.payload.numberOrder.pendingOrder;
        state.infoDashboard.numberOrder.deliveryOrder = action.payload.numberOrder.deliveryOrder;
        state.infoDashboard.numberOrder.completeOrder = action.payload.numberOrder.completeOrder;
        state.infoDashboard.numberOrder.cancelOrder = action.payload.numberOrder.cancelOrder;
        state.infoDashboard.numberOrder.totalRevenue = action.payload.numberOrder.totalRevenue;
    }
  }
});

export const {setInfoDashboard} = DashboardReducer.actions

export default DashboardReducer.reducer
//====================Action Thunk=========================

export const dashboard = ()=>{
    return async (dispatch)=>{
        try{
            dispatch(setDisplayLoadingAction());
            const result = await dashboardService.dashboard();
            if(result.status === STATUS_CODE.SUCCESS){
                dispatch(setInfoDashboard(result.data.content));
                dispatch(setHiddenLoadingAction());
            }
        }catch(err){
            console.log(err);
            dispatch(setHiddenLoadingAction());
        }
    }
}