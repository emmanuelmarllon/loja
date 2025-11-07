import React from "react";
import { Link, useParams } from "react-router-dom";
import products from "../data/products.json";

/**
 * Componente AllReviews
 * Página para exibir todas as avaliações de um produto específico
 * Obtém o produto pelo parâmetro de rota `id` e renderiza suas reviews.
 */
const AllReviews = () => {
  // Pega o parâmetro `id` da URL
  const { id } = useParams();
  const productId = parseInt(id);

  // Busca o produto na lista de produtos
  const product = products.find((p) => p.id === productId);

  // Caso o produto não exista, renderiza mensagem amigável de erro
  if (!product) {
    return (
      <section className="all-reviews-page">
        <Link to="/" className="btn-back">
          ← Voltar para produtos
        </Link>
        <h1>Produto não encontrado 😅</h1>
        <p>
          O produto que você está tentando acessar não existe ou foi removido.
        </p>
      </section>
    );
  }

  // Garante que `reviews` sempre seja um array
  const reviews = product.reviews || [];

  return (
    <section className="all-reviews-page">
      {/* Botão de retorno */}
      <Link to="/" className="btn-back">
        ← Voltar para produtos
      </Link>

      {/* Título e contextualização */}
      <h1>
        Aqui você pode ver <span>todas as avaliações</span>
      </h1>
      <p>
        Veja o que estão dizendo sobre <strong>{product.name}</strong>
      </p>

      {/* Conteúdo das avaliações */}
      <div className="reviews-content">
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((rev, i) => (
              <div key={i} className="review">
                {/* Nome do usuário e nota em estrelas */}
                <strong>{rev.user}</strong> -{" "}
                {"⭐".repeat(Math.min(rev.rating, 5))}
                {/* Comentário do usuário */}
                <p>{rev.comment}</p>
              </div>
            ))
          ) : (
            // Caso não existam reviews
            <p>Nenhuma avaliação encontrada 😅</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AllReviews;
