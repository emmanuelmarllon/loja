import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBars,
  faShoppingCart,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cartItems, removeFromCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * (1 - item.discount / 100), 0)
    .toFixed(2);

  return (
    <header>
      <h1>
        Minha <span>Loja</span>
      </h1>

      <nav>
        <ul>
          <li>
            <Link to="/">Início</Link>
          </li>
          <li>
            <Link to="/products">Produtos</Link>
          </li>
          <li>
            <Link to="/account">Conta</Link>
          </li>
        </ul>
      </nav>

      <div className="navs-icons-container">
        {/* mostra só se estiver em /products */}
        {location.pathname === "/products" && (
          <div className="search-input-container">
            <input type="text" placeholder="Buscar produtos..." />
            <FontAwesomeIcon icon={faSearch} />
          </div>
        )}

        <button onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faShoppingCart} />
          {cartItems.length > 0 && (
            <div className="products-count">{cartItems.length}</div>
          )}
        </button>

        <button className="menu-button">
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {/* Modal do carrinho */}
      {isModalOpen && (
        <div
          className="cart-panel-container"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cart-panel-header">
              <h2>Seu Cesto Tech</h2>
              <button
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p>Nenhum software por aqui… ainda 😶</p>
            ) : (
              <>
                <ul className="cart-list">
                  {cartItems.map((item, index) => {
                    const finalPrice = (
                      item.price *
                      (1 - item.discount / 100)
                    ).toFixed(2);
                    return (
                      <li key={index} className="cart-item">
                        <div className="cart-item-info">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="cart-item-img"
                          />
                          <div className="cart-item-details">
                            <strong>{item.name}</strong>
                            <div className="cart-item-prices">
                              <span className="new-price">R$ {finalPrice}</span>
                              {item.discount > 0 && (
                                <span className="old-price">
                                  R$ {item.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remover
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total:</span>
                    <strong>R$ {totalPrice}</strong>
                  </div>

                  <Link
                    to="/checkout"
                    className="checkout-btn"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Finalizar compra
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
