import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Account from "./pages/Account";
import AllReviews from "./pages/AllReviews";
import Checkout from "./pages/Checkout";
import AdminPage from "./pages/adimin";
function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/products"
          element={<Products searchTerm={searchTerm} />}
        />
        <Route path="/account" element={<Account />} />
        <Route
          path="/produtos"
          element={<Products searchTerm={searchTerm} />}
        />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/all-reviews/:id" element={<AllReviews />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}

export default App;
