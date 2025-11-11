import React, { useEffect, useState } from "react";
import Api, { API_BASE_URL } from "../api/Api";

const Account = () => {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [purchases, setPurchases] = useState([]);

  const logTurbo = (label, data) => console.log(`[LOG TURBO] ${label}:`, data);

  // Pega dados do usuário logado
  const fetchUser = async () => {
    logTurbo("fetchUser iniciado", {});
    try {
      const data = await Api.getMe();
      logTurbo("fetchUser data", data);
      setUser(data);
    } catch (err) {
      logTurbo("fetchUser erro", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Busca histórico de compras
  useEffect(() => {
    if (!user) return;

    const fetchPurchases = async () => {
      logTurbo("fetchPurchases iniciado", { userId: user.id });
      try {
        const purchasesData = await fetch(
          `${API_BASE_URL}/userPurchase/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ).then((res) => res.json());

        logTurbo("purchasesData bruta", purchasesData);

        const enrichedPurchases = await Promise.all(
          purchasesData.map(async (purchase) => {
            const itemsWithProduct = await Promise.all(
              purchase.items.map(async (item) => {
                try {
                  const product = await Api.getProduct(item.productId);
                  logTurbo("produto encontrado", product);
                  return { ...item, name: product.name, image: product.image };
                } catch (err) {
                  logTurbo("produto erro", { item, err });
                  return { ...item, name: "Produto indisponível" };
                }
              })
            );
            return { ...purchase, items: itemsWithProduct };
          })
        );

        logTurbo("enrichedPurchases", enrichedPurchases);
        setPurchases(enrichedPurchases);
      } catch (err) {
        logTurbo("fetchPurchases erro", err);
        setPurchases([]);
      }
    };

    fetchPurchases();
  }, [user]);

  // Login
  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await Api.login(identifier, password);
      console.log("[Login] Resposta do backend:", res);

      if (res.token) {
        localStorage.setItem("token", res.token);
        await fetchUser();
        window.location.reload(); // 🔄 força recarregar o app
      } else if (res.error) {
        setError(res.error);
      } else {
        setError("Usuário ou senha incorretos");
      }
    } catch (err) {
      console.error("[Login] Erro catch:", err);
      setError(err.message || "Erro ao tentar logar");
    }
  };

  // Registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      logTurbo("tentando registro", { name, username, email, password });
      const res = await Api.register(name, username, email, password);
      logTurbo("register response", res);
      if (res.token) {
        localStorage.setItem("token", res.token);
        await fetchUser();
        window.location.reload(); // 🔄 recarrega depois do cadastro
      } else {
        setError(res.error || "Erro ao registrar");
      }
    } catch (err) {
      logTurbo("register erro", err);
      setError("Erro ao tentar registrar");
    }
  };

  // Logout
  const handleLogout = () => {
    logTurbo("logout", {});
    localStorage.removeItem("token");
    setUser(null);
    setPurchases([]);
    window.location.reload(); // 🔄 limpa tudo e recarrega
  };

  if (!user) {
    return (
      <div className="auth-container">
        <h2>{isRegistering ? "Registrar-se" : "Login"}</h2>
        <form
          onSubmit={isRegistering ? handleRegister : handleLogin}
          className="auth-form"
        >
          {isRegistering ? (
            <>
              <input
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
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
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Email ou Usuário"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </>
          )}

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
        <aside className="profile-info">
          <div className="info-card">
            <div className="profile-header">
              <h2>Olá, {user.name}!</h2>
              <button className="logout-btn" onClick={handleLogout}>
                Sair
              </button>
            </div>
            <h3>Informações de Conta</h3>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>usuario:</strong> {user.user}
            </p>
          </div>

          <div className="actions-card">
            <h3>Ações rápidas</h3>
            <button>Editar Perfil</button>
            <button>Alterar Senha</button>
            <button>Ver Favoritos</button>
          </div>
        </aside>

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
