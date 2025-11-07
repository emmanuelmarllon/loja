import React from "react";
import { useCart } from "../context/CartContext";
import { useCartModal } from "../context/CartModalContext";

const ProductButton = ({ product }) => {
  const { cartItems, addToCart } = useCart();
  const { setIsModalOpen } = useCartModal();

  const isInCart = cartItems.some((item) => item.id === product.id);

  const handleClick = () => {
    if (!isInCart) {
      addToCart(product);
    } else {
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
