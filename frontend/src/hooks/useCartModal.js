import { useContext } from "react";
import { CartModalContext } from "../context/CartModalContextCore";

/**
 * Hook para acessar o estado do modal do carrinho de forma prática
 */
export const useCartModal = () => useContext(CartModalContext);
