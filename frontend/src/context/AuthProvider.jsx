// src/context/AuthProvider.js
import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContextCore";
import { loginUser, registerUser, fetchUserData } from "../api/AuthApi";
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    fetchUserData()
      .then((data) => setUser(data))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (identifier, password) => {
    const data = await loginUser(identifier, password);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    return data;
  }, []);

  const register = useCallback(async (name, username, email, password) => {
    const data = await registerUser(name, username, email, password);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    return data;
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("user-logout"));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
