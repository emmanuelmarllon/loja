/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const CartModalContext = createContext();

/**
 * Provider do estado do modal do carrinho
 * Permite abrir/fechar o modal de qualquer componente
 */
export const CartModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <CartModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </CartModalContext.Provider>
  );
};

/**
 * Hook para acessar o contexto do modal do carrinho
 */
export const useCartModal = () => useContext(CartModalContext);
