import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Home, StyleSociety, Login, Register, StyleStudio, Contest, Stylemarket } from "./pages";
import { Navbar, Footer } from "./components";
import ContestContent from "./components/contest/ContestContent";
import { AddContestForm } from "./components/contest/AddContest";
import { Provider } from "react-redux";  
import { store } from "./redux/store";  
import { AddShopForm } from "./components/styleMarket/AddShopForm";

// import Home from "./pages/Home";
// import StyleSociety from "./pages/Stylesociety";
// import Navbar from "./components/home/Navbar/Navbar";
// import Footer from "./components/home/Footer/Footer";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import StyleStudio from "./pages/StyleStudio";

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
        <Route path="/contest" element={<Contest />} />
        <Route path="/contest/add-contest" element={<AddContestForm />} />
        <Route path="/styleMarket/add-shop" element={<AddShopForm />} />
        <Route path="/contest/:id" element={<ContestContent />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
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
