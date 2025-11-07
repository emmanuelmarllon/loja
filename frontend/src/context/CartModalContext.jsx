/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const CartModalContext = createContext();

export const CartModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <CartModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </CartModalContext.Provider>
  );
};

export const useCartModal = () => useContext(CartModalContext);
