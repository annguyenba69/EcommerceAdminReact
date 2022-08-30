
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import AdminTemplate from './templates/AdminTemplate';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import AdminListUser from './pages/Admin/User/AdminListUser';
import Login from "./pages/User/LoginRegister/Login";
import Register from "./pages/User/LoginRegister/Register";
import LoginRegisterTemplate from "./templates/LoginRegisterTemplate";
import VerificationNotification from "./pages/User/LoginRegister/VerificationNotification";
import Loading from "./components/Loading/Loading";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import VerifyEmail from "./pages/User/LoginRegister/VerifyEmail";
import AdminAddUser from "./pages/Admin/User/AdminAddUser";
import DrawerHOC from "./HOC/DrawerHOC";
import AdminListProductCat from "./pages/Admin/ProductCat/AdminListProductCat";
import AdminListProduct from "./pages/Admin/Product/AdminListProduct";
import AdminAddProduct from "./pages/Admin/Product/AdminAddProduct";
import AdminEditProduct from "./pages/Admin/Product/AdminEditProduct";
import AdminListPostCat from "./pages/Admin/PostCat/AdminListPostCat";
import AdminListPost from "./pages/Admin/Post/AdminListPost";
import AdminEditPost from "./pages/Admin/Post/AdminEditPost";
import AdminAddPost from "./pages/Admin/Post/AdminAddPost";
import AdminListOrder from "./pages/Admin/Order/AdminListOrder";
import AdminListSlide from "./pages/Admin/Slide/AdminListSlide";
import AdminListPage from "./pages/Admin/Page/AdminListPage";
import AdminAddPage from "./pages/Admin/Page/AdminAddPage";


export const history = createBrowserHistory({ window });
function App() {
  return (
    <HistoryRouter history={history}>
      <Loading></Loading>
      <DrawerHOC></DrawerHOC>
      <Routes>
        <Route path="/" element={<LoginRegisterTemplate></LoginRegisterTemplate>}>
          <Route index path="login" element={<Login></Login>}></Route>
          <Route path="register" element={<Register></Register>}></Route>
          <Route path="verification-notification" element={<VerificationNotification></VerificationNotification>}></Route>
          <Route path="api/verify-email/:id/:hash" element={<VerifyEmail></VerifyEmail>} ></Route>
        </Route>
        <Route path='admin' element={<AdminTemplate></AdminTemplate>}>
          <Route index path='dashboard' element={<Dashboard></Dashboard>}></Route>

          <Route path='user/list-user' element={<AdminListUser></AdminListUser>}></Route>
          <Route path='user/add-user' element={<AdminAddUser></AdminAddUser>}></Route>

          <Route path="product-cat/list-product-cat" element={<AdminListProductCat></AdminListProductCat>}></Route>

          <Route path="product/list-product" element={<AdminListProduct></AdminListProduct>} ></Route>
          <Route path="product/add-product" element={<AdminAddProduct></AdminAddProduct>} ></Route>
          <Route path="product/edit-product/:id" element={<AdminEditProduct></AdminEditProduct>} ></Route>

          <Route path="post-cat/list-post-cat" element={<AdminListPostCat></AdminListPostCat>} ></Route>
          <Route path="post/list-post" element={<AdminListPost></AdminListPost>} ></Route>
          <Route path="post/edit-post/:id" element={<AdminEditPost></AdminEditPost>} ></Route>
          <Route path="post/add-post" element={<AdminAddPost></AdminAddPost>} ></Route>

          <Route path="order/list-order" element={<AdminListOrder></AdminListOrder>} ></Route>

          <Route path="slide/list-slide" element={<AdminListSlide></AdminListSlide>} ></Route>

          <Route path="page/list-page" element={<AdminListPage></AdminListPage>} ></Route>
          <Route path="page/add-page" element={<AdminAddPage></AdminAddPage>} ></Route>
        </Route>
      </Routes>
    </HistoryRouter>
  );
}

export default App;
