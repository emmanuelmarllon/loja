import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import PixQr from "../components/PixQr";

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * (1 - item.discount / 100), 0)
    .toFixed(2);

  const handleFinish = (e) => {
    e.preventDefault();
    alert("Compra finalizada com sucesso! 🎉");
    navigate("/"); // volta pra página inicial
  };

  if (cartItems.length === 0) {
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
        {/* Lista dos produtos */}
        <div className="checkout-products">
          <h2>Seus Softwares</h2>
          <ul>
            {cartItems.map((item, index) => {
              const finalPrice = (
                item.price *
                (1 - item.discount / 100)
              ).toFixed(2);
              return (
                <li key={index} className="checkout-item">
                  <img src={item.image} alt={item.name} />
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

        {/* Resumo da compra */}
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

          <form className="payment-form" onSubmit={handleFinish}>
            <h3>Pagamento</h3>

            <label>
              Nome no cartão
              <input type="text" placeholder="Ex: Emanuel S." required />
            </label>

            <label>
              Número do cartão
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                maxLength="19"
                required
              />
            </label>

            <div className="payment-row">
              <label>
                Validade
                <input type="text" placeholder="MM/AA" maxLength="5" required />
              </label>

              <label>
                CVV
                <input type="text" placeholder="123" maxLength="3" required />
              </label>
            </div>

            <button type="submit" className="btn btn-primary">
              Confirmar pagamento
            </button>

            <Link to="/products" className="btn btn-secondary">
              Voltar às compras
            </Link>
          </form>
          <div className="pix">
            <h3>Ou pague com PIX</h3>
            <PixQr amount={totalPrice} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
