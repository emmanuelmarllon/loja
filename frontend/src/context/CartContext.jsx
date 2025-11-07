/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

/**
 * Provider do carrinho de compras
 * Persiste os itens no localStorage para manter entre reloads
 */
export const CartProvider = ({ children }) => {
  // Inicializa o carrinho com os dados do localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sempre que cartItems mudar, atualiza o localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Adiciona um produto ao carrinho
   * Ignora se o produto já estiver presente
   */
  const addToCart = (product) => {
    const exists = cartItems.some((item) => item.id === product.id);
    if (exists) return;

    setCartItems([...cartItems, product]);
  };

  /**
   * Remove um produto do carrinho pelo ID
   */
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  /**
   * Limpa todo o carrinho
   */
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook para acessar o contexto do carrinho
 */
export const useCart = () => useContext(CartContext);
