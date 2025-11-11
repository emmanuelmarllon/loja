import React, { useState, useEffect, useRef } from "react";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PixQr from "../components/PixQr";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [processing, setProcessing] = useState(false);
  const [purchase, setPurchase] = useState(null);

  // Itens do checkout: produto único ou carrinho
  const itemsToCheckout = location.state?.singleProduct
    ? [location.state.singleProduct]
    : cartItems;

  // Calcula total
  const totalPrice = parseFloat(
    itemsToCheckout
      .reduce(
        (acc, item) =>
          acc + (item.price || 0) * (1 - (item.discount || 0) / 100),
        0
      )
      .toFixed(2)
  );

  // Prepara payload pro backend
  const buildPayload = () =>
    itemsToCheckout.map((item) => ({
      productId: item.id,
      quantity: item.quantity ?? 1,
    }));

  // Busca ou cria compra pendente
  const hasFetchedPending = useRef(false);

  useEffect(() => {
    if (!token || itemsToCheckout.length === 0 || hasFetchedPending.current)
      return;

    hasFetchedPending.current = true;

    const fetchOrCreatePending = async () => {
      try {
        const res = await fetch("http://localhost:3000/payment/pending", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: buildPayload(), total: totalPrice }),
        });

        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error || "Erro ao criar compra pending");

        setPurchase(data.purchase);
      } catch (err) {
        console.error("Erro ao criar/atualizar compra pendente:", err);
        alert(err.message);
      }
    };

    fetchOrCreatePending();
  }, [token, JSON.stringify(itemsToCheckout)]);

  // Atualiza status da compra (completed/cancelled)
  const updatePurchaseStatus = async (status) => {
    if (!purchase) return;
    setProcessing(true);

    try {
      const res = await fetch("http://localhost:3000/payment/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ txid: purchase.txid, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao atualizar status");

      if (status === "completed") {
        clearCart();
        setPurchase(null);
        alert("Pagamento concluído! 🎉");
        navigate("/");
      }
    } catch (err) {
      console.error("Erro atualizando status:", err);
      alert("Erro ao atualizar status da compra.");
    } finally {
      setProcessing(false);
    }
  };

  // Carrinho vazio
  if (itemsToCheckout.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Seu carrinho está vazio 😅</h2>
        <Link to="/products" className="btn btn-primary">
          Ir às compras
        </Link>
      </div>
    );
  }

  return (
    <section className="checkout-page">
      <h1>Finalizar Compra</h1>
      <div className="checkout-container">
        {/* Lista de produtos */}
        <div className="checkout-products">
          <h2>Produtos</h2>
          <ul>
            {itemsToCheckout.map((item, idx) => {
              const finalPrice = parseFloat(
                ((item.price || 0) * (1 - (item.discount || 0) / 100)).toFixed(
                  2
                )
              );
              return (
                <li key={idx} className="checkout-item">
                  {item.image && <img src={item.image} alt={item.name} />}
                  <div className="checkout-item-info">
                    <strong>{item.name}</strong>
                    <p>Licença digital (uso pessoal)</p>
                    <span className="checkout-item-price">R$ {finalPrice}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Resumo e pagamentos */}
        <div className="checkout-summary">
          <h2>Resumo</h2>
          <div className="summary-details">
            <div>
              <span>Subtotal</span>
              <span>R$ {totalPrice}</span>
            </div>
            <div>
              <span>Taxas</span>
              <span>R$ 0,00</span>
            </div>
            <div className="summary-total">
              <strong>Total</strong>
              <strong>R$ {totalPrice}</strong>
            </div>
          </div>

          {/* Formulário cartão */}
          <form
            className="payment-form"
            onSubmit={(e) => {
              e.preventDefault();
              updatePurchaseStatus("completed");
            }}
          >
            <h3>Pagamento Real</h3>
            <label>
              Nome no cartão
              <input type="text" placeholder="Ex: Emanuel S." required />
            </label>
            <label>
              Número do cartão
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                required
              />
            </label>
            <div className="payment-row">
              <label>
                Validade
                <input type="text" placeholder="MM/AA" maxLength={5} required />
              </label>
              <label>
                CVV
                <input type="text" placeholder="123" maxLength={3} required />
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={processing}
            >
              {processing ? "Processando..." : "Confirmar pagamento"}
            </button>
          </form>

          {/* Simulação */}
          <button
            onClick={() => updatePurchaseStatus("completed")}
            className="btn btn-success"
            disabled={processing}
            style={{ marginTop: 10 }}
          >
            {processing ? "Processando..." : "Simular Pagamento"}
          </button>

          {/* PIX */}
          {purchase && (
            <div className="pix" style={{ marginTop: 16 }}>
              <h3>Ou pague com PIX</h3>
              <PixQr
                amount={totalPrice}
                description={`Pagamento de licença - Pedido #${purchase.txid}`}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Checkout;
