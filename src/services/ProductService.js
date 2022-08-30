import { baseService } from "./baseService";

class ProductService extends baseService{
    constructor(){
        super();
    }

    //ProductCat
    getAllListProductCats = (keyword= "")=>{
        return this.get(`api/getAllListProductCats?keyword=${keyword}`);
    }

    getAllListActiveProductCats = ()=>{
        return this.get(`api/getAllListActiveProductCats`);
    }

    addProductCat = (model)=>{
        return this.post(`api/addProductCat`, model);
    }

    getDetailProductCatById = (id)=>{
        return this.get(`api/getDetailProductCatById/${id}`);
    }

    editProductCat = (model)=>{
        return this.put(`api/editProductCat`, model);
    }

    deleteProductCat = (id)=>{
        return this.delete(`api/deleteProductCat/${id}`);
    }

    //Product
    getAllProducts = (status= "",keyword="")=>{
        return this.get(`api/getAllProducts/?status=${status}&keyword=${keyword}`);
    }

    getDetailProduct = (id)=>{
        return this.get(`api/getDetailProduct/${id}`);
    }

    addProduct = (model)=>{
        return this.post(`api/addProduct`, model);
    }

    softDeleteProduct = (id)=>{
        return this.delete(`api/softDeleteProduct/${id}`);
    }

    forceDeleteProduct = (id)=>{
        return this.delete(`api/forceDeleteProduct/${id}`);
    }

    restoreProduct = (id)=>{
        return this.get(`api/restoreProduct/${id}`);
    }

    editProduct = (model)=>{
        return this.post(`api/editProduct`, model);
    }
}

export const productService = new ProductService()