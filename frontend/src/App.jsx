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
import PrivateRoute from "./components/PrivateRoute";
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

        {/* Rotas protegidas */}
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
