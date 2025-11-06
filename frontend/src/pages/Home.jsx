import React from "react";
import { Link } from "react-router-dom";
import Products_featured from "../components/products_featured.jsx";
const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <h1>Os melhores softwares por preços justos</h1>
        <p>Baixe, ative e comece a criar como um profissional.</p>
        <Link to="/products" className="btn btn-primary">
          Ver produtos
        </Link>
      </section>

      {/* Produtos em destaque */}
      <section className="featured">
        <h2>Mais populares</h2>
        <Products_featured />
      </section>
    </>
  );
};

export default Home;
