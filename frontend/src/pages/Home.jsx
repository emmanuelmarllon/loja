import React from "react";
import { Link } from "react-router-dom";
import Products_featured from "../components/Products_featured.jsx";

/**
 * Componente Home
 * Página inicial do site
 * Exibe seções principais: hero e produtos em destaque.
 */
const Home = () => {
  return (
    <>
      {/* Seção Hero: destaque principal da página */}
      <section className="hero">
        <h1>Os melhores softwares por preços justos</h1>
        <p>Baixe, ative e comece a criar como um profissional.</p>
        {/* Link para a página de produtos */}
        <Link to="/products" className="btn btn-primary">
          Ver produtos
        </Link>
      </section>

      {/* Seção de produtos em destaque */}
      <section className="featured">
        <h2>Mais populares</h2>
        {/* Componente que lista os produtos destacados */}
        <Products_featured />
      </section>
    </>
  );
};

export default Home;
