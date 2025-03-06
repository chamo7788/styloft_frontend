import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Home, StyleSociety, Login, Register, StyleStudio, Stylemarket } from "./pages";
import { Navbar, Footer } from "./components";
import { Provider } from "react-redux";  
import { store } from "./redux/store";  
import Profile from "./components/Profile/Profile";
import Contest from "./pages/Contest";
import { AddShopForm } from "./components/styleMarket/AddShopForm";

function App() {
  const location = useLocation();

  // List of paths where the Navbar should be hidden
  const hideNavbarPaths = ["/login", "/register"];
  const hideFooterPaths = ["/login", "/register"];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/stylesociety" element={<StyleSociety />} />
        <Route path="/stylestudio" element={<StyleStudio />} />
        <Route path="/styleMarket" element={<Stylemarket />} />
        <Route path="/contest/*" element={<Contest />} />
        <Route path="/styleMarket/add-shop" element={<AddShopForm />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!hideFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
}

export default function MainApp() {
  return (
    <BrowserRouter>
      <Provider store={store}>  
        <App />
      </Provider>
    </BrowserRouter>
  );
}