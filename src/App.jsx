import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import StyleSociety from "./pages/stylesociety";
import Navbar from "./components/home/Navbar/Navbar";
import Footer from "./components/home/Footer/Footer";

export default function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stylesociety" element={<StyleSociety />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    <Footer />
    </BrowserRouter>
  );
}
