export const API_BASE_URL = "http://localhost:3000/api";

const getToken = () => localStorage.getItem("token");

const request = async (endpoint, options = {}, auth = false) => {
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (auth) {
    const token = getToken();
    if (!token) {
      console.log("[LOG] Usuário não logado ao acessar", endpoint);
      throw new Error("Usuário não logado");
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    console.log("[LOG] Erro na requisição", {
      endpoint,
      status: res.status,
      data,
    });
    throw new Error(data.error || "Erro na requisição");
  }

  console.log("[LOG] Requisição bem-sucedida", { endpoint, data });
  return data;
};

/* ================= AUTH ================= */
export const login = (identifier, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });

export const register = (name, user, email, password) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, user, email, password }),
  });

export const getMe = async () => {
  const me = await request("/auth/me", {}, true);
  me._id = me._id || me.id;
  console.log("[LOG] Dados do usuário logado (getMe):", me);
  return me;
};

/* ================= PRODUCTS ================= */
export const getProducts = () => request("/products");
export const getProduct = (id) => request(`/products/${id}`);

/* ================= CHECKOUT ================= */
export const checkout = (items) =>
  request(
    "/checkout",
    { method: "POST", body: JSON.stringify({ items }) },
    true
  );

export const generatePix = () => request("/checkout/pix", {}, true);

/* ================= REVIEWS ================= */
export const createReview = async ({
  comment,
  rating,
  productId,
  userId,
  username,
}) => {
  if (!userId) throw new Error("Usuário não logado!");
  if (!comment || rating < 1 || !productId)
    throw new Error("Campos obrigatórios faltando!");

  const payload = {
    comment,
    rating,
    productId,
    userId,
    username,
  };

  console.log("[LOG] Criando review com dados:", payload);

  return request(
    "/reviews",
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { Authorization: `Bearer ${getToken()}` },
    },
    true
  );
};

export const getReviews = (productId) => {
  console.log("[LOG] Pegando reviews do produto", productId);
  return request(`/reviews/${productId}`);
};

// Atualiza review: envia apenas comment e rating
export const updateReview = (reviewId, comment, rating) => {
  if (!reviewId) throw new Error("ID da review não definido");
  console.log("[LOG] Atualizando review", { reviewId, comment, rating });
  return request(
    `/reviews/${reviewId}`,
    {
      method: "PUT",
      body: JSON.stringify({ comment, rating }),
    },
    true
  );
};

// Deleta review: envia o id no corpo para evitar erro do backend
export const deleteReview = (reviewId) => {
  if (!reviewId) throw new Error("ID da review não definido");
  console.log("[LOG] Deletando review", { reviewId });
  return request(
    `/reviews/${reviewId}`,
    {
      method: "DELETE",
      body: JSON.stringify({ id: reviewId }),
    },
    true
  );
};

const Api = {
  login,
  register,
  getMe,
  getProducts,
  getProduct,
  checkout,
  generatePix,
  createReview,
  getReviews,
  updateReview,
  deleteReview,
};

export default Api;
