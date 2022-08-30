import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    visible: false
}

const LoadingReducer = createSlice({
    name: 'UserReducer',
    initialState,
    reducers: {
        setDisplayLoadingAction: (state, action) => {
            state.visible = true;
        },
        setHiddenLoadingAction: (state, action) => {
            state.visible = false;
        }
    },
});
export const { setDisplayLoadingAction, setHiddenLoadingAction } = LoadingReducer.actions
export default LoadingReducer.reducer
