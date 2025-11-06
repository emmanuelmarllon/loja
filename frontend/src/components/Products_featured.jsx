import React, { useEffect, useState } from "react";
import PriceTag from "../components/PriceTag";
import { Link } from "react-router-dom";

const Products_featured = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products"); // API real
        const data = await res.json();
        setProducts(data.filter((p) => p.featured)); // só os featured
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="products-grid">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <img className="product-img" src={product.image} alt={product.name} />
          <h2>{product.name}</h2>
          <p className="card-desc">
            {product.shortDesc || product.description}
          </p>
          <div>
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

export default Products_featured;
