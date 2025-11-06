import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    };
    loadProducts();
  }, []);

  return (
    <section className="featured">
      <h2>
        Todos os <span>Produtos</span>
      </h2>
      <p>Confira todos os softwares disponíveis na nossa loja</p>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-img"
            />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <Link
              to={`/product/${product.id}`}
              className="btn btn-primary product-btn"
            >
              Ver Produto
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
