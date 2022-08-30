import { baseService } from "./baseService";

class OrderService extends baseService{
    constructor(){
        super();
    }

    getAllOrders = (order_status_id="", keyword="")=>{
        return this.get(`api/getAllOrders?order_status_id=${order_status_id}&keyword=${keyword}`);
    }

    getDetailOrder = (id)=>{
        return this.get(`api/getDetailOrder/${id}`);
    }

    editOrder = (model)=>{
        return this.put(`api/editOrder`, model);
    }
}

export const orderService = new OrderService();