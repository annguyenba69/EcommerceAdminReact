import { baseService } from "./baseService";

class PostService extends baseService{
    constructor(){
        super();
    }

    getAllListPostCat = (keyword="")=>{
        return this.get(`api/getAllListPostCat?keyword=${keyword}`);
    }

    getDetailPostCatById = (id)=>{
        return this.get(`api/getDetailPostCatById/${id}`);
    }

    addPostCat = (model)=>{
        return this.post(`api/addPostCat`, model);
    }

    editPostCat = (model)=>{
        return this.put(`api/editPostCat`, model);
    }

    deletePostCat = (id)=>{
        return this.delete(`api/deletePostCat/${id}`);
    }

    getAllPosts = (status="",keyword="")=>{
        return this.get(`api/getAllPosts?status=${status}&keyword=${keyword}`);
    }

    softDeletePost = (id)=>{
        return this.delete(`api/softDeletePost/${id}`);
    }

    forceDeletePost = (id)=>{
        return this.delete(`api/forceDeletePost/${id}`);
    }

    restorePost = (id)=>{
        return this.get(`api/restorePost/${id}`);
    }

    getDetailPost = (id)=>{
        return this.get(`api/getDetailPost/${id}`);
    }

    getAllListActivePostCat = ()=>{
        return this.get(`api/getAllListActivePostCat`);
    }

    editPost = (model)=>{
        return this.post(`api/editPost`, model);
    }

    addPost = (model)=>{
        return this.post(`api/addPost`, model);
    }
}

export const postService = new PostService();