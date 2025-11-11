// src/api/AuthApi.js
import Api from "./Api";

export const fetchUserData = async () => Api.getMe();
export const loginUser = async (identifier, password) =>
  Api.login(identifier, password);
export const registerUser = async (name, user, email, password) =>
  Api.register(name, user, email, password);
