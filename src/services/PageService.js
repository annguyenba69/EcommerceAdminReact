import { baseService } from "./baseService";

class PageService extends baseService{
    constructor(){
        super();
    }

    addPage = (model)=>{
        return this.post(`api/addPage`, model);
    }

    getDetailPage = (id)=>{
        return this.get(`api/getDetailPage/${id}`);
    }

    editPage = (model)=>{
        return this.put(`api/editPage`, model);
    }

    getAllListPages = (status="", keyword="")=>{
        return this.get(`api/getAllListPages?status=${status}&keyword=${keyword}`);
    }

    softDeletePage = (id)=>{
        return this.delete(`api/softDeletePage/${id}`);
    }

    forceDeletePage = (id)=>{
        return this.delete(`api/forceDeletePage/${id}`);
    }

    restorePage = (id)=>{
        return this.put(`api/restorePage/${id}`);
    }

}
export const pageService = new PageService();