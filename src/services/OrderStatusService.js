import { baseService } from "./baseService";

class OrderStatusService extends baseService{
    constructor(){
        super();
    }

    getAllOrderStatus = ()=>{
        return this.get(`api/getAllOrderStatus`);
    }
}
export const orderStatusService = new OrderStatusService();