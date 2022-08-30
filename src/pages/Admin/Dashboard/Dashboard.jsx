import { Tag } from 'antd';
import moment from 'moment';
import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dashboard } from '../../../redux/reducers/DashboardReducer';
import { NavLink } from 'react-router-dom';
import { DOMAIN } from '../../../utils/configSystem';


export default function Dashboard() {
  const dispatch = useDispatch();
  const { latest, recentAddProducts, numberOrder } = useSelector(state => state.DashboardReducer.infoDashboard);
  const renderStatus = (order_status_id) => {
    if (order_status_id === 1) {
      return <Tag color="geekblue">
        Đang Xử Lý
      </Tag>
    } else if (order_status_id === 2) {
      return <Tag color="purple">
        Đang Giao Hàng
      </Tag>
    }
    else if (order_status_id === 3) {
      return <Tag color="green">
        Hoàn Thành
      </Tag>
    }
    else if (order_status_id === 4) {
      return <Tag color="red">
        Hủy Đơn
      </Tag>
    }
  }

  const renderTableLatest = () => {
    return latest?.map((order, index) => {
      return <tr key={index}>
        <td><a href="pages/examples/invoice.html">{order.id}</a></td>
        <td>{order.user.name}</td>
        <td>{order.totalPrice.toLocaleString() + "đ"}</td>
        <td>
          {renderStatus(order.order_status_id)}
        </td>
        <td>
          <div className="sparkbar" data-color="#00a65a" data-height={20}>{moment(order.created_at).format("DD/MM/YYYY")}</div>
        </td>
      </tr>
    })
  }

  const renderRecentlyAddProduct = () => {
    return recentAddProducts?.map((product, index) => {
      return <li className="item">
        <div className="product-img">
        <img src={DOMAIN + product.product_thumbnails[0].thumbnail} alt="Product Image" className="img-size-50" />
        </div>
        <div className="product-info">
          <a href="javascript:void(0)" className="product-title">{product.name}
            <span className="badge badge-warning float-right">{product.price.toLocaleString() + "đ"}</span></a>
        </div>
      </li>
    })
  }
  useEffect(() => {
    dispatch(dashboard());
  }, []);
  return (
    <div className='content'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-12'>
            <div className="card-footer">
              <div className="row">
                <div className="col-sm-3 col-6">
                  <div className="description-block border-right">
                    <h5 className="description-header">{numberOrder?.totalRevenue.toLocaleString() + "đ"}</h5>
                    <span className="description-text">TOTAL REVENUE</span>
                  </div>
                </div>
                <div className="col-sm-3 col-6">
                  <div className="description-block border-right">
                    <h5 className="description-header">{numberOrder?.pendingOrder}</h5>
                    <span className="description-text">ĐANG XỬ LÝ</span>
                  </div>
                </div>
                <div className="col-sm-3 col-6">
                  <div className="description-block border-right">
                    <h5 className="description-header">{numberOrder?.deliveryOrder}</h5>
                    <span className="description-text">ĐANG GIAO HÀNG</span>
                  </div>
                </div>
                <div className="col-sm-3 col-6">
                  <div className="description-block">
                    <h5 className="description-header">{numberOrder?.completeOrder}</h5>
                    <span className="description-text">THÀNH CÔNG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-md-8'>
            <div className="card">
              <div className="card-header border-transparent">
                <h3 className="card-title">Latest Orders</h3>
                <div className="card-tools">
                  <button type="button" className="btn btn-tool" data-card-widget="collapse">
                    <i className="fas fa-minus" />
                  </button>
                  <button type="button" className="btn btn-tool" data-card-widget="remove">
                    <i className="fas fa-times" />
                  </button>
                </div>
              </div>
              {/* /.card-header */}
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table m-0">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Username</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderTableLatest()}
                    </tbody>
                  </table>
                </div>
                {/* /.table-responsive */}
              </div>
              {/* /.card-body */}
              <div className="card-footer clearfix">
                <NavLink to={"/admin/order/list-order"} className="btn btn-sm btn-secondary float-right">View All Orders</NavLink>
              </div>
              {/* /.card-footer */}
            </div>
          </div>
          <div className='col-md-4'>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recently Added Products</h3>
                <div className="card-tools">
                  <button type="button" className="btn btn-tool" data-card-widget="collapse">
                    <i className="fas fa-minus" />
                  </button>
                  <button type="button" className="btn btn-tool" data-card-widget="remove">
                    <i className="fas fa-times" />
                  </button>
                </div>
              </div>
              {/* /.card-header */}
              <div className="card-body p-0">
                <ul className="products-list product-list-in-card pl-2 pr-2">
                  {renderRecentlyAddProduct()}
                  {/* /.item */}
                </ul>
              </div>
              {/* /.card-body */}
              <div className="card-footer text-center">
                <NavLink to={"/admin/product/list-product"} className="uppercase">View All Products</NavLink>
              </div>
              {/* /.card-footer */}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
