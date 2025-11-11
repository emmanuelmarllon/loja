import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReviewList from "../components/ReviewList";
import { useAuth } from "../hooks/useAuth";
import Api from "../api/Api";

const AllReviews = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [productName, setProductName] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await Api.getProduct(id);
        setProductName(product.name);
      } catch (err) {
        console.log("Erro ao buscar produto:", err);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <section className="all-reviews-page">
      <Link to={`/product/${id}`} className="btn-back">
        ← Voltar para o produto
      </Link>
      <h1>Todas as avaliações</h1>
      <p>
        Aqui você pode ver o que estão falando sobre{" "}
        <strong>{productName}</strong>
      </p>
      <ReviewList productId={id} user={user} limit={null} />
    </section>
  );
};

export default AllReviews;
