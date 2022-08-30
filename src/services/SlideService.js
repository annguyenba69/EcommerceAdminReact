import { baseService } from "./baseService";

class SlideService extends baseService {
    constructor() {
        super();
    }

    addSlide = (model)=>{
        return this.post(`api/addSlide`, model);
    }

    getAllSlides = (status="")=>{
        return this.get(`api/getAllSlides?status=${status}`);
    }

    softDeleteSlide = (id)=>{
        return this.delete(`api/softDeleteSlide/${id}`);
    }

    forceDeleteSlide = (id)=>{
        return this.delete(`api/forceDeleteSlide/${id}`);
    }

    restoreSlide = (id)=>{
        return this.put(`api/restoreSlide/${id}`);
    }

    changeStatusSlide = (id)=>{
        return this.put(`api/changeStatusSlide/${id}`);
    }
}

export const slideService = new SlideService();