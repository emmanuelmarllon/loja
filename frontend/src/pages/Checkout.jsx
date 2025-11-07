import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PixQr from "../components/PixQr";

/**
 * Componente Checkout
 * Página de finalização de compra
 * Exibe produtos selecionados, resumo do pedido e opções de pagamento.
 * Suporta compra de produto único (via `location.state`) ou do carrinho inteiro.
 */
const Checkout = () => {
  const { cartItems, clearCart } = useCart(); // Contexto do carrinho
  const { token } = useAuth(); // Contexto do usuário autenticado
  const navigate = useNavigate(); // Navegação programática
  const location = useLocation(); // Pega informações da rota

  const [processing, setProcessing] = useState(false); // Controle de loading

  // Permite checkout de um único produto ou de todo o carrinho
  const singleProduct = location.state?.singleProduct;
  const itemsToCheckout = singleProduct ? [singleProduct] : cartItems;

  // Calcula o preço total considerando desconto de cada item
  const totalPrice = itemsToCheckout
    .reduce(
      (acc, item) => acc + item.price * (1 - (item.discount || 0) / 100),
      0
    )
    .toFixed(2);

  // Constrói o payload da requisição de checkout
  const buildPayload = () =>
    itemsToCheckout.map((item) => ({
      productId: item.id,
      quantity: item.quantity ?? 1,
    }));

  /**
   * Função para processar pagamento
   * @param {boolean} simulate - Se true, apenas simula pagamento
   */
  const processPayment = async (simulate = false) => {
    if (!token) return alert("Você precisa estar logado."); // Proteção de acesso
    if (itemsToCheckout.length === 0) return alert("Carrinho vazio 😅"); // Proteção de carrinho vazio

    setProcessing(true);

    try {
      const res = await fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: buildPayload() }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          simulate
            ? "Pagamento simulado aprovado e compra registrada! 🎉"
            : "Compra finalizada com sucesso! 🎉"
        );
        if (!singleProduct) clearCart(); // Limpa o carrinho se não for compra única
        navigate("/"); // Redireciona para home
      } else {
        alert(`Erro: ${data.error || "Desconhecido"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao processar compra.");
    } finally {
      setProcessing(false);
    }
  };

  // Caso não haja itens para checkout
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
        {/* Lista de produtos selecionados */}
        <div className="checkout-products">
          <h2>Produtos</h2>
          <ul>
            {itemsToCheckout.map((item, idx) => {
              const finalPrice = (
                item.price *
                (1 - (item.discount || 0) / 100)
              ).toFixed(2);
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

        {/* Resumo do pedido e opções de pagamento */}
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

          {/* Formulário de pagamento real */}
          <form
            className="payment-form"
            onSubmit={(e) => {
              e.preventDefault();
              processPayment();
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

          {/* Botão de simulação de pagamento */}
          <button
            onClick={() => processPayment(true)}
            className="btn btn-success"
            disabled={processing}
            style={{ marginTop: 10 }}
          >
            {processing ? "Processando..." : "Simular Pagamento"}
          </button>

          {/* Opção de pagamento via PIX */}
          <div className="pix" style={{ marginTop: 16 }}>
            <h3>Ou pague com PIX</h3>
            <PixQr amount={totalPrice} />
          </div>

          {/* Link para voltar às compras */}
          <Link
            to="/products"
            className="btn btn-secondary"
            style={{ marginTop: 10 }}
          >
            Voltar às compras
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
