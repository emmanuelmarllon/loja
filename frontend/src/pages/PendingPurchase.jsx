import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PendingPurchase = ({ user, token }) => {
  const [pending, setPending] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/purchases/pending/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          if (res.status === 404) {
            setPending(null); // sem compra pendente
            return;
          }
          throw new Error("Erro ao buscar compra pendente");
        }
        const data = await res.json();
        setPending(data);
      } catch (err) {
        console.error(err);
        setPending(null);
      }
    };

    fetchPending();
  }, [user, token]);

  const handleGoToPurchase = () => {
    if (!pending) return;
    navigate(`/checkout/${pending.id}`);
  };

  const handleCancelPurchase = async () => {
    if (!pending) return;
    if (!window.confirm("Tem certeza que quer cancelar a compra pendente?"))
      return;
    try {
      const res = await fetch(`http://localhost:3000/purchases/${pending.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao cancelar compra");
      setPending(null);
      alert("Compra pendente cancelada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao cancelar a compra pendente");
    }
  };

  if (!pending) return null;

  return (
    <div className="pending-purchase-notice">
      <p>
        Você tem uma compra pendente no valor de R${pending.total.toFixed(2)}.
      </p>
      <button onClick={handleGoToPurchase}>Ir para compra</button>
      <button onClick={handleCancelPurchase} className="cancel-button">
        Cancelar compra
      </button>
    </div>
  );
};

export default PendingPurchase;
