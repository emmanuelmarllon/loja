import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Api from "../api/Api";
import ProductButton from "../components/ProductButton";
import ReviewList from "../components/ReviewList";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("[Product.jsx] 🔹 Fetch do produto iniciado, id:", id);
        setLoading(true);

        const productData = await Api.getProduct(id);
        console.log("[Product.jsx] 🔹 Produto recebido:", productData);

        setProduct(productData);
        setMainImage(productData.image || "/placeholder.png");

        const allProducts = await Api.getProducts();
        const related = allProducts.filter(
          (p) => p.category === productData.category && p.id !== productData.id
        );
        setRelatedProducts(related);
      } catch (err) {
        console.error("[Product.jsx] ❌ Erro ao buscar produto:", err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  console.log("[Product.jsx] 🔹 Usuário logado:", user);

  const handleBuyNow = () => {
    navigate("/checkout", { state: { singleProduct: product } });
  };

  if (loading) return <p>Carregando produto...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!product) return <p>Produto não encontrado</p>;

  return (
    <section className="product-page">
      <div className="breadcrumbs">
        <Link to="/">Início</Link> / <Link to="/products">Produtos</Link> /{" "}
        <span>{product.name}</span>
      </div>

      <div className="product-main">
        <div className="product-images">
          <img src={mainImage} alt={product.name} className="main-img" />
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

        <div className="product-info">
          <h1>{product.name}</h1>
          <p>{product.shortDesc}</p>

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

          <div className="product-actions">
            <ProductButton product={product} />
            <button className="btn btn-secondary" onClick={handleBuyNow}>
              Comprar agora
            </button>
          </div>

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

      <div className="product-reviews">
        <h3>Avaliações</h3>
        <ReviewList productId={product.id} user={user} />
      </div>

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
