import React from 'react'
import { Outlet } from 'react-router-dom'

export default function LoginRegisterTemplate() {
    return (
        <div className="container">
            <div className="row m-5 no-gutters shadow-lg">
                <div className="col-md-6 d-none d-md-block">
                    <img src="https://images.unsplash.com/photo-1566888596782-c7f41cc184c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=2134&q=80" className="img-fluid" style={{ minHeight: '100%' }} alt="" />
                </div>
                <div className="col-md-6 bg-white p-5">
                    <div className="form-style">
                        <Outlet></Outlet>
                    </div>
                </div>
            </div>
        </div>
    )
}
