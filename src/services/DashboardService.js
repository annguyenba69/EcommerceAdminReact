import { baseService } from "./baseService";

class DashboardService extends baseService{
    constructor(){
        super();
    }

    dashboard = ()=>{
        return this.get(`api/dashboard`);
    }
}

export const dashboardService = new DashboardService();