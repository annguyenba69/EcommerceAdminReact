import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { USER_LOGIN } from '../utils/configSystem'
import { openNotificationWithIcon } from '../utils/notification';
// import shortid from "shortid";


export default function AdminTemplate() {
    const { userLogin } = useSelector(state => state.UserReducer);
    const redirectToLogin = () => {
        openNotificationWithIcon('error', 'Error', 'You do not have permission to access Admin')
        return (
            <Navigate to="/login" replace={true} />
        )
    }
    if (userLogin.role !== 'Admin') {
        return redirectToLogin();
    }
    return (
        <div>
            {/* Preloader */}
            {/* <div className=" preloader flex-column justify-content-center align-items-center">
                <img className="animation__shake" src="dist/img/AdminLTELogo.png" alt="AdminLTELogo" height={60} width={60} />
            </div> */}
            {/* Navbar */}
            <nav className="main-header navbar navbar-expand navbar-white navbar-light" style={{ zIndex: 'auto' }}>
                {/* Left navbar links */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                    </li>
                    <li className="nav-item d-none d-sm-inline-block">
                        <NavLink to={"/admin/dashboard"} className="nav-link">Dashboard</NavLink>
                    </li>
                </ul>
                {/* Right navbar links */}
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="fullscreen" href="#" role="button">
                            <i className="fas fa-expand-arrows-alt" />
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-widget="control-sidebar" data-controlsidebar-slide="true" href="#" role="button">
                            <i className="fas fa-th-large" />
                        </a>
                    </li>
                </ul>
            </nav>
            {/* Main Sidebar Container */}
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                {/* Brand Logo */}
                <a className="brand-link">
                    <img src={process.env.PUBLIC_URL + "/assets/admin/dist/img/AdminLTELogo.png"} alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                    <span className="brand-text font-weight-light">Admin</span>
                </a>
                {/* Sidebar */}
                <div className="sidebar">
                    {/* Sidebar user panel (optional) */}
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <img src={process.env.PUBLIC_URL +"/assets/admin/dist/img/admin.jpg"} className="img-circle elevation-2" alt="User Image" />
                        </div>
                        <div className="info">
                            <a className="d-block">{userLogin?.name}</a>
                        </div>
                    </div>
                    {/* Sidebar Menu */}
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <NavLink to={"/admin/dashboard"} className="nav-item">
                                <a href="#" className="nav-link">
                                    <i className="nav-icon fas fa-chart-pie" />
                                    <p>
                                        Dashboard
                                    </p>
                                </a>
                            </NavLink>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <i className="nav-icon fas fa-copy" />
                                    <p>
                                        Trang
                                        <i className="fas fa-angle-left right" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview" style={{ display: 'none' }}>
                                    <li className="nav-item">
                                        <NavLink to={"/admin/page/add-page"} className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>Th??m M???i</p>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to={"/admin/page/list-page"} className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>Danh S??ch</p>
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <i className="nav-icon fas fa-edit" />
                                    <p>
                                        B??i Vi???t
                                        <i className="fas fa-angle-left right" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview" style={{ display: 'none' }}>
                                    <li className="nav-item">
                                        <NavLink to={"/admin/post/add-post"} className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>Th??m M???i</p>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to={"/admin/post/list-post"} className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>Danh S??ch</p>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to={"/admin/post-cat/list-post-cat"} className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>Danh M???c</p>
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <i className="nav-icon fab fa-product-hunt" />
                                    <p>
                                        S???n Ph???m
                                        <i className="fas fa-angle-left right" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview" style={{ display: 'none' }}>
                                    <li className="nav-item">
                                        <NavLink to={"/admin/product/add-product"} className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>Th??m M???i</p>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to={"/admin/product/list-product"} className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>Danh S??ch</p>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to={"/admin/product-cat/list-product-cat"} className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>Danh M???c</p>
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <i className="nav-icon fab fa-salesforce" />
                                    <p>
                                        B??n H??ng
                                        <i className="fas fa-angle-left right" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview" style={{ display: 'none' }}>
                                    <li className="nav-item">
                                        <NavLink to={"/admin/order/list-order"} className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>????n H??ng</p>
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <i className="nav-icon far fa-image" />
                                    <p>
                                        Slide
                                        <i className="fas fa-angle-left right" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview" style={{ display: 'none' }}>
                                    <li className="nav-item">
                                        <NavLink to={"/admin/slide/list-slide"} className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>Danh S??ch</p>
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <i className=" nav-icon far fa-user" />
                                    <p>
                                        Users
                                        <i className="fas fa-angle-left right" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview" style={{ display: 'none' }}>
                                    <li className="nav-item">
                                        <NavLink to={"/admin/user/add-user"} className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>Th??m m???i</p>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to={"/admin/user/list-user"} className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>Danh S??ch</p>
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                    {/* /.sidebar-menu */}
                </div>
                {/* /.sidebar */}
            </aside>
            <div className="content-wrapper pt-4 px-3">
                <Outlet></Outlet>
            </div>
        </div>

    )
}
