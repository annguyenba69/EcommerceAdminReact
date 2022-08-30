import { createSlice } from '@reduxjs/toolkit'
import AdminEditProduct from '../../pages/Admin/Product/AdminEditProduct';

const initialState = {
  visible: false,
  Component: "",
  title: ""
}

const DrawerReducer = createSlice({
  name: "DrawerReducer",
  initialState,
  reducers: {
    setVisibleTrueAction: (state, action) => {
      state.title = action.payload.title;
      state.Component = action.payload.Component;
      state.visible = true;
    },
    setVisibleFalseAction: (state, action) => {
      state.visible = false;
    }
  }
});

export const { setVisibleTrueAction, setVisibleFalseAction } = DrawerReducer.actions

export default DrawerReducer.reducer

//========================Action-Thunk==========================

