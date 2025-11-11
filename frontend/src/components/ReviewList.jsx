import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../api/Api";
import { Link } from "react-router-dom";
import { Loading } from "./loading";
import Account from "../pages/Account";

const Star = ({ filled, onClick }) => (
  <span
    style={{
      fontSize: "1.3em",
      cursor: onClick ? "pointer" : "default",
      color: filled ? "#f5b50a" : "#ccc",
    }}
    onClick={onClick}
  >
    ★
  </span>
);

const ReviewItem = ({ rev, user, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(rev.comment || "");
  const [editRating, setEditRating] = useState(rev.rating || 0);

  const userId = user?.id || user?._id || user?.userId;
  const reviewUserId =
    rev.userId || rev.user?.id || rev.user?._id || rev.user?.userId;
  const isOwner =
    userId && reviewUserId && String(userId) === String(reviewUserId);

  const handleSave = async () => {
    if (!rev.id && !rev._id) return alert("ID da review não encontrado!");
    await onEdit(rev.id || rev._id, comment, editRating);
    setEditing(false);
  };

  return (
    <div
      style={{ marginBottom: 15, padding: 10, borderBottom: "1px solid #eee" }}
    >
      <strong style={{ color: isOwner ? "#f5b50a" : "#fff" }}>
        {rev.user?.user || rev.username || "Usuário"} {isOwner ? "(você)" : ""}
      </strong>
      <span style={{ marginLeft: 10, color: "#888", fontSize: "0.8em" }}>
        {rev.createdAt && new Date(rev.createdAt).toLocaleDateString()}
      </span>

      <div className="stars" style={{ margin: "5px 0" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            filled={i <= (editing ? editRating : rev.rating)}
            onClick={editing ? () => setEditRating(i) : undefined}
          />
        ))}
      </div>

      {editing ? (
        <>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "100%", minHeight: 60, marginBottom: 5 }}
          />
          <button onClick={handleSave}>Salvar</button>
          <button onClick={() => setEditing(false)} style={{ marginLeft: 5 }}>
            Cancelar
          </button>
        </>
      ) : (
        <p>{rev.comment}</p>
      )}

      {isOwner && !editing && (
        <div className="review-actions" style={{ marginTop: 5 }}>
          <button onClick={() => setEditing(true)}>Editar</button>
          <button
            onClick={() => onDelete(rev.id || rev._id)}
            style={{ marginLeft: 5 }}
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  );
};

const ReviewList = ({ productId, user, limit = 5 }) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => Api.getReviews(productId),
    enabled: !!productId,
  });

  const createMutation = useMutation({
    mutationFn: ({ comment, rating, productId, userId, username }) =>
      Api.createReview({ comment, rating, productId, userId, username }),
    onSuccess: () => queryClient.invalidateQueries(["reviews", productId]),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, comment, rating }) =>
      Api.updateReview(id, comment, rating),
    onSuccess: () => queryClient.invalidateQueries(["reviews", productId]),
  });

  const deleteMutation = useMutation({
    mutationFn: Api.deleteReview,
    onSuccess: () => queryClient.invalidateQueries(["reviews", productId]),
  });

  const handleCreate = () => {
    if (!newComment || newRating < 1) return alert("Preencha tudo!");
    if (!user?.id && !user?._id && !user?.userId)
      return alert("Usuário não logado!");

    createMutation.mutate({
      comment: newComment,
      rating: newRating,
      productId,
      userId: user.id || user._id || user.userId,
      username: user.name || user.username || user.user,
    });

    setNewComment("");
    setNewRating(0);
  };

  const handleEdit = (id, comment, rating) =>
    updateMutation.mutate({ id, comment, rating });

  const handleDelete = (id) => {
    if (!window.confirm("Tem certeza?")) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) return <Loading />;

  const displayedReviews = limit ? reviews.slice(0, limit) : reviews;

  return (
    <div className="reviews-section">
      <div className="reviews-list">
        {displayedReviews.length === 0 ? (
          <p>Sem comentários 😶</p>
        ) : (
          displayedReviews.map((rev) => (
            <ReviewItem
              key={rev.id || rev._id}
              rev={rev}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {limit && reviews.length > limit && (
        <Link to={`/all-reviews/${productId}`}>
          <button className="btn btn-primary">Ver todos os comentários</button>
        </Link>
      )}

      {user?.id || user?._id || user?.userId ? (
        <div className="review-form">
          <h4>Deixe seu comentário</h4>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                filled={i <= newRating}
                onClick={() => setNewRating(i)}
              />
            ))}
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Comente..."
          />
          <button onClick={handleCreate}>Enviar</button>
        </div>
      ) : (
        <p style={{ opacity: 0.7 }}>Faça login para comentar.</p>
      )}
    </div>
  );
};

export default ReviewList;
