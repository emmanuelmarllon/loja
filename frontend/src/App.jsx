import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Componentes
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Páginas
import Home from "./pages/Home";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Account from "./pages/Account";
import AllReviews from "./pages/AllReviews";
import Checkout from "./pages/Checkout";
import AdminPage from "./pages/adimin";

/**
 * App.jsx
 * Componente principal da aplicação
 * Configura:
 * - Navbar global
 * - Rotas públicas
 * - Rotas privadas (protegidas)
 */
function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      {/* Navbar global */}
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Rotas da aplicação */}
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route
          path="/products"
          element={<Products searchTerm={searchTerm} />}
        />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/all-reviews/:id" element={<AllReviews />} />
        <Route path="/account" element={<Account />} />

        {/* Rotas privadas */}
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
