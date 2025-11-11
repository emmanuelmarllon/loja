import React, { useState, useCallback } from "react";
import { CartModalContext } from "./CartModalContextCore";

export const CartModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const toggleModal = useCallback(() => setIsModalOpen((prev) => !prev), []);

  return (
    <CartModalContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        openModal,
        closeModal,
        toggleModal,
      }}
    >
      {children}
    </CartModalContext.Provider>
  );
};
