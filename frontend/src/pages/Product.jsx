import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProductButton from "../components/ProductButton";

/**
 * Componente Product
 * Página de detalhes de um produto individual.
 * Exibe informações do produto, imagens, preço, avaliações e produtos relacionados.
 */
const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados do componente
  const [product, setProduct] = useState(null); // Produto atual
  const [mainImage, setMainImage] = useState(""); // Imagem principal selecionada
  const [reviews, setReviews] = useState([]); // Lista de avaliações
  const [newReview, setNewReview] = useState({
    user: "",
    rating: 5,
    comment: "",
  }); // Avaliação que o usuário está escrevendo
  const [relatedProducts, setRelatedProducts] = useState([]); // Produtos da mesma categoria
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(""); // Mensagem de erro

  /**
   * Efeito para buscar dados do produto, avaliações e produtos relacionados
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Buscar produto principal
        const productRes = await fetch(`http://localhost:3000/products/${id}`);
        if (!productRes.ok) throw new Error("Erro ao buscar produto");
        const productData = await productRes.json();
        setProduct(productData);
        setMainImage(productData.image);

        // Buscar avaliações do produto
        const reviewsRes = await fetch(`http://localhost:3000/reviews/${id}`);
        if (!reviewsRes.ok) throw new Error("Erro ao buscar avaliações");
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);

        // Buscar produtos relacionados (mesma categoria)
        const relatedRes = await fetch(
          `http://localhost:3000/products?category=${productData.category}`
        );
        if (!relatedRes.ok)
          throw new Error("Erro ao buscar produtos relacionados");
        let relatedData = await relatedRes.json();
        // Remover produto atual da lista
        relatedData = relatedData.filter((p) => p.id !== productData.id);
        setRelatedProducts(relatedData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /**
   * Envia uma nova avaliação para o backend
   */
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.user || !newReview.comment) return;

    try {
      const res = await fetch(`http://localhost:3000/reviews/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (!res.ok) throw new Error("Erro ao enviar avaliação");

      const savedReview = await res.json();
      setReviews([savedReview, ...reviews]); // Adiciona a nova avaliação no topo da lista
      setNewReview({ user: "", rating: 5, comment: "" }); // Limpa o formulário
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
    }
  };

  /**
   * Compra imediata de um único produto
   */
  const handleBuyNow = () => {
    navigate("/checkout", { state: { singleProduct: product } });
  };

  // Mensagens de carregamento ou erro
  if (loading) return <p>Carregando produto...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!product) return <p>Produto não encontrado</p>;

  return (
    <section className="product-page">
      {/* Breadcrumbs para navegação */}
      <div className="breadcrumbs">
        <Link to="/">Início</Link> / <Link to="/products">Produtos</Link> /{" "}
        <span>{product.name}</span>
      </div>

      <div className="product-main">
        {/* Seção de imagens do produto */}
        <div className="product-images">
          <img
            src={mainImage || "/placeholder.png"}
            alt={product.name}
            className="main-img"
          />
          <div className="thumbnail-container">
            {[product.image, ...(product.gallery || [])].map((img, idx) => (
              <img
                key={idx}
                src={img || "/placeholder.png"}
                alt={`${product.name} ${idx + 1}`}
                className="thumbnail-img"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          <div className="description">{product.description}</div>
        </div>

        {/* Informações e ações do produto */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <p>{product.shortDesc}</p>

          {/* Preço e desconto */}
          <div className="product-price">
            {product.discount > 0 ? (
              <>
                <span className="new-price">
                  R$ {(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="old-price">R$ {product.price.toFixed(2)}</span>
                <span className="discount-badge">-{product.discount}% OFF</span>
              </>
            ) : (
              <span className="new-price">R$ {product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Botões de ação */}
          <div className="product-actions">
            <ProductButton product={product} /> {/* Adicionar ao carrinho */}
            <button className="btn btn-secondary" onClick={handleBuyNow}>
              Comprar agora
            </button>
          </div>

          {/* Lista de detalhes do produto */}
          <div className="product-details">
            <h3>Detalhes do Produto</h3>
            <ul>
              {product.details?.map((det, i) => (
                <li key={i}>{det}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Avaliações do produto */}
      <div className="product-reviews">
        <h3>Avaliações</h3>
        {reviews.slice(0, 3).map((rev, i) => (
          <div key={i} className="review">
            <strong>{rev.user}</strong> - {"⭐".repeat(rev.rating)}
            <p>{rev.comment}</p>
          </div>
        ))}
        {reviews.length > 3 && (
          <Link
            to={`/all-reviews/${product.id}`}
            className="btn-toggle-reviews"
          >
            Mostrar todos
          </Link>
        )}

        {/* Formulário de nova avaliação */}
        <div className="review-form">
          <h4>Escreva sua avaliação</h4>
          {user ? (
            <form onSubmit={handleReviewSubmit}>
              <textarea
                placeholder="Comentário"
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
              />
              <button type="submit">Publicar</button>
            </form>
          ) : (
            <p>Faça login para comentar.</p>
          )}
        </div>
      </div>

      {/* Produtos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Produtos relacionados</h2>
          <div className="products-grid">
            {relatedProducts.map((prod) => (
              <div key={prod.id} className="product-card">
                <img src={prod.image || "/placeholder.png"} alt={prod.name} />
                <h3>{prod.name}</h3>
                <p>{prod.shortDesc}</p>
                <Link to={`/product/${prod.id}`} className="btn btn-primary">
                  Ver produto
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Product;
