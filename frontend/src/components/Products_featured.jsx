import React, { useEffect, useState } from "react";
import PriceTag from "../components/PriceTag";
import { Link } from "react-router-dom";

/**
 * Componente de exibição de produtos em destaque
 */
const ProductsFeatured = () => {
  const [products, setProducts] = useState([]);

  // Carrega produtos da API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products");
        const data = await res.json();
        // Filtra apenas produtos marcados como "featured"
        setProducts(data.filter((p) => p.featured));
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    };
    loadProducts();
  }, []);

  if (products.length === 0) {
    return <p>Nenhum produto em destaque disponível no momento.</p>;
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <img className="product-img" src={product.image} alt={product.name} />
          <h2>{product.name}</h2>
          <p className="card-desc">
            {product.shortDesc || product.description}
          </p>

          <div className="product-card-footer">
            <PriceTag price={product.price} discount={product.discount || 0} />
            <Link to={`/product/${product.id}`}>
              <button className="btn-primary product-btn">Ver produto</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsFeatured;
