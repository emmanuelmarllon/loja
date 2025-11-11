import { useContext } from "react";
import { CartContext } from "../context/CartContextCore.js";

/**
 * Hook para acessar o contexto do carrinho de forma prática
 */
export const useCart = () => useContext(CartContext);
