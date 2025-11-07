import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Componente Products
 * Lista todos os produtos disponíveis e permite filtrar por searchTerm.
 */
const Products = ({ searchTerm }) => {
  const [products, setProducts] = useState([]); // Lista de produtos do backend

  /**
   * Efeito que carrega os produtos assim que o componente é montado
   */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Requisição para buscar todos os produtos
        const res = await fetch("http://localhost:3000/products");
        const data = await res.json();
        setProducts(data); // Atualiza o estado com os produtos
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    };
    loadProducts();
  }, []);

  /**
   * Filtra os produtos com base no termo de pesquisa
   * Ignora maiúsculas/minúsculas para melhor UX
   */
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="featured">
      {/* Título da seção */}
      <h2>
        Todos os <span>Produtos</span>
      </h2>
      <p>Confira todos os softwares disponíveis na nossa loja</p>

      {/* Grid de produtos */}
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              {/* Imagem do produto */}
              <img
                src={product.image}
                alt={product.name}
                className="product-img"
              />
              {/* Nome e descrição */}
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              {/* Botão para acessar a página do produto */}
              <Link to={`/product/${product.id}`} className="btn btn-primary">
                Ver Produto
              </Link>
            </div>
          ))
        ) : (
          // Mensagem caso nenhum produto seja encontrado
          <p>Nenhum produto encontrado 😕</p>
        )}
      </div>
    </section>
  );
};

export default Products;
