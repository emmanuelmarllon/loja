import React from "react";
import { Link } from "react-router-dom";
import products from "../data/products.json";
import { useParams } from "react-router-dom";
const AllReviews = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const reviews = product ? product.reviews : [];
  return (
    <section className="all-reviews-page">
      <Link to="/" className="btn-back">
        ← Voltar para produtos
      </Link>
      <h1>
        Aqui você pode ver <span>todas as avaliações</span>
      </h1>
      <p>
        Veja o que estão dizendo sobre <strong>{product?.name}</strong>
      </p>

      <div className="reviews-content">
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((rev, i) => (
              <div key={i} className="review">
                <strong>{rev.user}</strong> - {"⭐".repeat(rev.rating)}
                <p>{rev.comment}</p>
              </div>
            ))
          ) : (
            <p>Nenhuma avaliação encontrada 😅</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AllReviews;
