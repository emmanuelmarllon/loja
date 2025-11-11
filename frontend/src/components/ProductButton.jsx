import React from "react";
import { useCart } from "../hooks/useCart";
import { useCartModal } from "../hooks/useCartModal";

/**
 * Botão para adicionar ou acessar produto no carrinho
 * @param {Object} product - Produto a ser adicionado ou visualizado
 */
const ProductButton = ({ product }) => {
  const { cartItems, addToCart } = useCart();
  const { setIsModalOpen } = useCartModal();

  // Verifica se o produto já está no carrinho
  const isInCart = cartItems.some((item) => item.id === product.id);

  const handleClick = () => {
    if (!isInCart) {
      // Adiciona ao carrinho se ainda não estiver
      addToCart(product);
    } else {
      // Abre o modal do carrinho se já estiver
      setIsModalOpen(true);
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleClick}>
      {isInCart ? "Ver no carrinho" : "Adicionar ao carrinho"}
    </button>
  );
};

export default ProductButton;
