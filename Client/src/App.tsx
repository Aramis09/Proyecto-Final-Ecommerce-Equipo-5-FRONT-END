import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Products } from "./pages/Products/Products";
import { Detail } from "./components/Detail/Detail";
import { CheckOut } from "./pages/CheckOut/CheckOut";
import { Transaccion } from "./pages/mercadoPagoTesting/mpLink";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppDispatch, useAppSelector } from "./redux/hooks/hooks";
import { getListUsers } from "./redux/actions/userAction";
import {
  getTopRatedProducts,
  setGlobalDiscount,
} from "./redux/actions/productAction";
import { DashboardUser } from "./components/Dashboard/Users/DashboardUser";
import { DashboardProducts } from "./components/Dashboard/ProductsList/DashboardProducts";
import WishList from "./pages/WishList/WishList";
import "./App.css";
import { Friends } from "./pages/Friends/Friends";
import Library from "./pages/library/Library";

import { setShoppingCartFromLocalStorage } from "./redux/actions/localStorageAction";
import { getShoppingCartUserFromDB } from './redux/actions/shoppingCartAction';


function App() {
  const dispatch = useAppDispatch();
  const { user } = useAuth0();
  const userEmail = user?.email;

  const listUsersData = useAppSelector(
    (state) => state.userReducer.listUsersData
  );

  const admin = listUsersData.find((item) => item.email === userEmail);
  if (admin) {
    const isAdmin = admin.admin;
    console.log(
      `El usuario ${userEmail} tiene permisos de administrador: ${isAdmin}`
    );
  } else {
    console.log(`El usuario ${userEmail} no se encuentra en la lista`);
  }

  useEffect(() => {
    dispatch(getTopRatedProducts());

    dispatch(getListUsers());// este falla no se porque, rompe cosas
    dispatch(setGlobalDiscount())

    if(typeof user !== 'undefined'){
      dispatch(getShoppingCartUserFromDB(user.email))
    }else{
      dispatch(setShoppingCartFromLocalStorage());
    }


  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/mptest" element={<Transaccion />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/wish" element={<WishList />} />
          <Route path="/library" element={<Library />} />
          <Route path="/auth0" element={<Auth0/>}/>
          <Route path="/:id" element={<Detail />} />
          {admin?.admin && (
            <>
              <Route path="/users" element={<DashboardUser />} />
              <Route path="/productsList" element={<DashboardProducts />} />
            </>
          )}
        </Routes>
        <Outlet />
      </div>
    </BrowserRouter>
  );
}

export default App;
