import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Account from "./pages/Account";
import AllReviews from "./pages/AllReviews";
import Checkout from "./pages/Checkout";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/account" element={<Account />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/all-reviews/:id" element={<AllReviews />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </>
  );
}

export default App;
