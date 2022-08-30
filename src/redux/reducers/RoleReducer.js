import { createSlice } from '@reduxjs/toolkit'
import { roleService } from '../../services/RoleService';
import { STATUS_CODE } from '../../utils/configSystem';

const initialState = {
    allListRoles : []
}

const RoleReducer = createSlice({
  name: "RoleReducer",
  initialState,
  reducers: {
    getAllListRolesAction : (state, action)=>{
        state.allListRoles = action.payload
    }
  }
});

export const {getAllListRolesAction} = RoleReducer.actions

export default RoleReducer.reducer

//=========================Action Thunk================================

export const getAllListRoles = ()=>{
    return async (dispatch)=>{
        try{
            const result = await roleService.getAllListRoles();
            if(result.status === STATUS_CODE.SUCCESS){
                dispatch(getAllListRolesAction(result.data.content));
            }
        }catch(err){
            console.log(err)
        }
    }
}