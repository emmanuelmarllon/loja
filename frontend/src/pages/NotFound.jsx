// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        textAlign: "center",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
      <h2 style={{ margin: "10px 0" }}>Ops! Página não encontrada.</h2>
      <p style={{ maxWidth: 400 }}>
        Parece que você se perdeu. Clique no botão abaixo para voltar à página
        inicial.
      </p>
      <Link to="/">
        <button
          style={{
            padding: "10px 20px",
            marginTop: 20,
            backgroundColor: "#3498db",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Voltar para Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
