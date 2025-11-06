// src/api.js
export const fetchProducts = async () => {
  try {
    const res = await fetch("http://localhost:3000/products");
    return await res.json();
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/products/${id}`);
    return await res.json();
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
  }
};

export const postReview = async (productId, review) => {
  try {
    const res = await fetch(`http://localhost:3000/reviews/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
    return await res.json();
  } catch (err) {
    console.error("Erro ao enviar review:", err);
  }
};

export const registerUser = async (user) => {
  try {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (err) {
    console.error("Erro no registro:", err);
  }
};

export const loginUser = async (user) => {
  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (err) {
    console.error("Erro no login:", err);
  }
};
