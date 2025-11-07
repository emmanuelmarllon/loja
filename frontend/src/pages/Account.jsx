import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Página de Conta do Usuário
 * Permite login, registro e visualização de histórico de compras
 */
const Account = () => {
  const { user, login, register, logout, getPurchases } = useAuth();

  // Estados de formulário
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Histórico de compras
  const [purchases, setPurchases] = useState([]);

  // Buscar compras do usuário quando logado
  useEffect(() => {
    if (!user) return;

    const fetchPurchases = async () => {
      try {
        const purchasesData = await getPurchases(user.id);

        // Enriquecer cada item da compra com nome e imagem do produto
        const enrichedPurchases = await Promise.all(
          purchasesData.map(async (purchase) => {
            const itemsWithProduct = await Promise.all(
              purchase.items.map(async (item) => {
                const res = await fetch(
                  `http://localhost:3000/products/${item.productId}`
                );
                const product = await res.json();
                return { ...item, name: product.name, image: product.image };
              })
            );
            return { ...purchase, items: itemsWithProduct };
          })
        );

        setPurchases(enrichedPurchases);
      } catch {
        setPurchases([]);
      }
    };

    fetchPurchases();
  }, [user, getPurchases]);

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(email, password);
      if (!res?.token) setError(res?.error || "Email ou senha inválidos");
    } catch {
      setError("Erro ao tentar logar");
    }
  };

  // Registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await register(name, email, password);
      if (res?.error) setError(res.error);
    } catch {
      setError("Erro ao tentar registrar");
    }
  };

  // Formulário de login/registro
  if (!user) {
    return (
      <div className="auth-container">
        <h2>{isRegistering ? "Registrar-se" : "Login"}</h2>
        <form
          onSubmit={isRegistering ? handleRegister : handleLogin}
          className="auth-form"
        >
          {isRegistering && (
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            {isRegistering ? "Registrar" : "Entrar"}
          </button>
        </form>
        {error && <p className="error-msg">{error}</p>}
        <p
          className="toggle-auth"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError("");
          }}
        >
          {isRegistering
            ? "Já tem uma conta? Faça login"
            : "Não tem uma conta? Registre-se"}
        </p>
      </div>
    );
  }

  // Página do usuário logado
  return (
    <div className="profile-page">
      <div className="profile-content">
        {/* Sidebar */}
        <aside className="profile-info">
          <div className="info-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <h2>Olá, {user.name}! </h2>
              <button className="logout-btn" onClick={logout}>
                Sair
              </button>
            </div>
            <h3>Informações de Conta</h3>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>

          <div className="actions-card">
            <h3>Ações rápidas</h3>
            <button>Editar Perfil</button>
            <button>Alterar Senha</button>
            <button>Ver Favoritos</button>
          </div>
        </aside>

        {/* Histórico de compras */}
        <section className="profile-purchases">
          <h3>Histórico de Compras</h3>
          {purchases.length === 0 ? (
            <p>Você ainda não comprou nenhum software.</p>
          ) : (
            <ul className="purchases-list">
              {purchases.map((purchase) => (
                <li key={purchase.id} className="purchase-card">
                  <div className="purchase-header">
                    <span>Compra ID: {purchase.id}</span>
                    <span>Total: R$ {purchase.total.toFixed(2)}</span>
                  </div>
                  <span className="purchase-date">
                    Data:{" "}
                    {purchase.createdAt
                      ? new Date(purchase.createdAt).toLocaleDateString("pt-BR")
                      : "Indisponível"}
                  </span>
                  <ul>
                    {purchase.items.map((item) => (
                      <li key={item.productId} className="purchase-item">
                        {item.image && <img src={item.image} alt={item.name} />}
                        <span>{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Account;
