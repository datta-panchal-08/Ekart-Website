import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Verify from './pages/Verify';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Sales from './pages/admin/Sales';
import AddProduct from './pages/admin/AddProduct';
import AdminProducts from './pages/admin/AdminProducts';
import Orders from './pages/admin/Orders';
import ShowUserOrders from './pages/admin/ShowUserOrders';
import AllUsers from './pages/admin/AllUsers';
import UserInfo from './pages/admin/UserInfo';
import ProtectedRoutes from './components/ProtectedRoutes';
import ProductDetail from './pages/ProductDetail';
import AddressForm from './pages/AddressForm';
import OrderSuccess from './pages/OrderSuccess';

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar /><Home /></>
  },
  {
    path: "/signup",
    element: <><Signup /></>
  }, {
    path: "/login",
    element: <><Login /></>
  }, {
    path: "/verify",
    element: <><Verify /></>
  }, {
    path: "/verify/:token",
    element: <><VerifyEmail /></>
  }, {
    path: "/profile/:userId",
    element: <ProtectedRoutes><Navbar /><Profile /></ProtectedRoutes>
  }, {
    path: "/product/:id",
    element: <ProtectedRoutes><Navbar /><ProductDetail /></ProtectedRoutes>
  }, {
    path: "/products",
    element: <ProtectedRoutes><Navbar /><Products /></ProtectedRoutes>
  }, {
    path: "/cart",
    element: <ProtectedRoutes><Navbar /><Cart /></ProtectedRoutes>
  }, {
    path: "/address",
    element: <ProtectedRoutes><AddressForm /></ProtectedRoutes>
  },{
    path: "/order-success",
    element: <ProtectedRoutes><OrderSuccess /></ProtectedRoutes>
  }, {
    path: "/dashboard",
    element: <ProtectedRoutes adminOnly={true}><Navbar/><Dashboard /></ProtectedRoutes>,
    children: [
      {
        path: "sales",
        element: <Sales />
      }, {
        path: "add-product",
        element: <AddProduct />
      }, {
        path: "products",
        element: <AdminProducts />
      }, {
        path: "orders",
        element: <Orders />
      }, {
        path: "users/orders/:userId",
        element: <ShowUserOrders />
      }, {
        path: "users",
        element: <AllUsers />
      }, {
        path: "users/:id",
        element: <UserInfo />
      }
    ]
  }
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App