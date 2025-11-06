import { useCart } from "../context/CartContext"; // suposição

const ProductButton = ({ product }) => {
  const { cartItems, addToCart } = useCart();

  // Checa se o produto já está no carrinho
  const isInCart = cartItems.some((item) => item.id === product.id);

  const handleClick = () => {
    if (!isInCart) {
      addToCart(product);
    } else {
      // redireciona pra página do carrinho
      window.location.href = "/cart";
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleClick}>
      {isInCart ? "Ver no carrinho" : "Adicionar ao carrinho"}
    </button>
  );
};

export default ProductButton;
