import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Account = () => {
  const { user, login, register, logout, getPurchases } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchPurchases = async () => {
        const data = await getPurchases();
        setPurchases(data || []);
      };
      fetchPurchases();
    }
  }, [user, getPurchases]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(email, password);
    if (!res.token) setError(res.error || "Email ou senha inválidos");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const res = await register(name, email, password);
    if (res.error) {
      setError(res.error);
    } else {
      const loginRes = await login(email, password);
      if (!loginRes.token)
        setError(loginRes.error || "Erro ao logar após registro");
    }
  };

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

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <h2>Olá, {user.name}!</h2>
        <button onClick={logout} className="logout-btn">
          Sair
        </button>
      </div>

      {/* Informações principais */}
      <div className="profile-info">
        <h3>Informações de Conta</h3>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      {/* Histórico de compras */}
      <div className="profile-purchases">
        <h3>Histórico de Compras</h3>
        {purchases.length === 0 ? (
          <p>Você ainda não comprou nenhum software.</p>
        ) : (
          <ul className="purchases-list">
            {purchases.map((item) => (
              <li key={item.id} className="purchase-card">
                <strong>{item.name}</strong>
                <p>Preço: R${item.price}</p>
                <p>Comprado em: {new Date(item.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Ações rápidas */}
      <div className="profile-actions">
        <h3>Ações rápidas</h3>
        <button>Editar Perfil</button>
        <button>Alterar Senha</button>
        <button>Ver Favoritos</button>
      </div>
    </div>
  );
};

export default Account;
