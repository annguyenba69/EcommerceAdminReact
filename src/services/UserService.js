import { baseService } from "./baseService";

class UserService extends baseService {
    constructor() {
        super();
    }

    getAllListUsers = (status = "all") => {
        return this.get(`api/getAllListUsers?status=${status}`);
    }

    register = (model) => {
        return this.post('api/register', model);
    }

    verifyEmail = (id, hash) => {
        return this.get(`api/verify-email/${id}/${hash}`)
    }

    login = (model) => {
        return this.post(`api/login`, model);
    }

    addUser = (model) => {
        return this.post(`api/addUser`, model);
    }

    getDetailUserById = (id) => {
        return this.get(`api/getDetailUserById/${id}`);
    }

    editUser = (model) => {
        return this.put(`api/editUser`, model);
    }

    softDeleteUser = (id) => {
        return this.delete(`api/softDeleteUser/${id}`);
    }

    forceDeleteUser = (id)=>{
        return this.delete(`api/forceDelete/${id}`);
    }

    restoreUser = (id) => {
        return this.get(`api/restoreUser/${id}`);
    }

    findUserByKeyword = (status,keyword)=>{
        return this.get(`api/findUserByKeyword?status=${status}&keyword=${keyword}`);
    }

}

export const userService = new UserService();