import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../api/Api"; // Certifique-se que está correto o caminho

/**
 * Componente para exibir aviso de compra pendente
 */
const PendingPurchase = ({ user, token }) => {
  const [pending, setPending] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPending = async () => {
      try {
        console.log(
          "[PendingPurchase] Buscando compra pendente do usuário",
          user.id
        );
        const data = await Api.request(
          `/userPurchase/pending/${user.id}`,
          {},
          true
        );
        console.log("[PendingPurchase] Compra pendente encontrada:", data);
        setPending(data);
      } catch (err) {
        console.error("[PendingPurchase] Erro ao buscar compra pendente:", err);
        setPending(null);
      }
    };
    if (user && token) fetchPending();
  }, [user, token]);

  const handleGoToPurchase = () => {
    if (!pending) return;
    navigate(`/checkout/${pending.id}`);
  };

  const handleCancelPurchase = async () => {
    if (!pending) return;
    if (!window.confirm("Tem certeza que quer cancelar a compra pendente?"))
      return;

    try {
      console.log("[PendingPurchase] Cancelando compra pendente:", pending.id);
      await Api.request(
        `/userPurchase/${pending.id}`,
        { method: "DELETE" },
        true
      );
      setPending(null);
      alert("Compra pendente cancelada com sucesso!");
    } catch (err) {
      console.error("[PendingPurchase] Erro ao cancelar compra:", err);
      alert("Erro ao cancelar a compra pendente");
    }
  };

  if (!pending) return null;

  return (
    <div className="pending-purchase-notice">
      <p>
        Você tem uma compra pendente no valor de R${pending.total.toFixed(2)}.
      </p>
      <button onClick={handleGoToPurchase}>Ir para compra</button>
      <button onClick={handleCancelPurchase} className="cancel-button">
        Cancelar compra
      </button>
    </div>
  );
};

/**
 * Componente Products
 * Lista todos os produtos disponíveis e permite filtrar por searchTerm.
 */
const Products = ({ searchTerm, user, token }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log("[Products] Buscando todos os produtos");
        const data = await Api.getProducts();
        console.log("[Products] Produtos carregados:", data.length);
        setProducts(data);
      } catch (err) {
        console.error("[Products] Erro ao buscar produtos:", err);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="featured">
      {user && token && <PendingPurchase user={user} token={token} />}

      <h2>
        Todos os <span>Produtos</span>
      </h2>
      <p>Confira todos os softwares disponíveis na nossa loja</p>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-img"
              />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <Link to={`/product/${product.id}`} className="btn btn-primary">
                Ver Produto
              </Link>
            </div>
          ))
        ) : (
          <p>Nenhum produto encontrado 😕</p>
        )}
      </div>
    </section>
  );
};

export default Products;
