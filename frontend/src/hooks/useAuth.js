// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextCore";

export const useAuth = () => useContext(AuthContext);
