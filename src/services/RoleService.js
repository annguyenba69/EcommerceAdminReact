import { baseService } from "./baseService";

class RoleService extends baseService{
    constructor(){
        super();
    }

    getAllListRoles = ()=>{
        return this.get('api/getAllListRoles');
    }
}

export const roleService = new RoleService();