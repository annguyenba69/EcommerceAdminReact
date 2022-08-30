import { configureStore } from '@reduxjs/toolkit'
import DashboardReducer from './reducers/DashboardReducer'
import DrawerReducer from './reducers/DrawerReducer'
import LoadingReducer from './reducers/LoadingReducer'
import OrderReducer from './reducers/OrderReducer'
import OrderStatusReducer from './reducers/OrderStatusReducer'
import PageReducer from './reducers/PageReducer'
import PostCatReducer from './reducers/PostCatReducer'
import PostReducer from './reducers/PostReducer'
import ProductCatReducer from './reducers/ProductCatReducer'
import ProductReducer from './reducers/ProductReducer'
import RoleReducer from './reducers/RoleReducer'
import SlideReducer from './reducers/SlideReducer'
import UserReducer from './reducers/UserReducer'
export const store = configureStore({
  reducer: {
    UserReducer,
    LoadingReducer,
    RoleReducer,
    DrawerReducer,
    ProductCatReducer,
    ProductReducer,
    PostCatReducer,
    PostReducer,
    OrderReducer,
    OrderStatusReducer,
    SlideReducer,
    PageReducer,
    DashboardReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
