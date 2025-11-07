/* eslint-disable react-refresh/only-export-components */
import React, { useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext();

/**
 * Provider responsável pelo estado de autenticação
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    parsed.isAdmin = parsed.isAdmin ?? parsed.IsAdmin ?? false;
    return parsed;
  });

  // Busca usuário sempre que houver token
  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setUser(null);
    }
  }, [token]);

  // Busca dados do usuário atual
  const fetchUser = async (jwtToken) => {
    try {
      const res = await fetch("http://localhost:3000/auth/me", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (!res.ok) {
        logout();
        return;
      }

      const data = await res.json();
      const userData = data.user || {};
      userData.isAdmin = userData.isAdmin ?? userData.IsAdmin ?? false;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch {
      logout();
    }
  };

  // Login de usuário
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        await fetchUser(data.token);
      }

      return data;
    } catch {
      return { error: "Erro ao conectar com o servidor" };
    }
  };

  // Registro de usuário
  const register = async (name, email, password) => {
    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!data.error) {
        await login(email, password);
      }

      return data;
    } catch {
      return { error: "Erro ao conectar com o servidor" };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Busca compras do usuário
  const getPurchases = async () => {
    const jwt = token || localStorage.getItem("token");
    if (!jwt || !user) return [];

    try {
      const res = await fetch(
        `http://localhost:3000/users/${user.id}/purchases`,
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      if (!res.ok) return [];
      const data = await res.json();
      return data || [];
    } catch {
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, register, getPurchases }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar AuthContext
export const useAuth = () => useContext(AuthContext);
