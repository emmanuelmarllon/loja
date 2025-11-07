// src/api.js
/**
 * API helper para toda a comunicação com o backend.
 * Mantém todas as requisições centralizadas para melhor manutenção.
 */

/**
 * Busca todos os produtos disponíveis.
 * @returns {Promise<Array>} Lista de produtos
 */
export const fetchProducts = async () => {
  try {
    const res = await fetch("http://localhost:3000/products");
    return await res.json();
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
  }
};

/**
 * Busca um produto específico pelo seu ID.
 * @param {number} id - ID do produto
 * @returns {Promise<Object>} Produto encontrado
 */
export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/products/${id}`);
    return await res.json();
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
  }
};

/**
 * Envia uma nova avaliação para um produto específico.
 * @param {number} productId - ID do produto
 * @param {Object} review - Objeto da review { user, rating, comment }
 * @returns {Promise<Object>} Review criada
 */
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

/**
 * Registra um novo usuário.
 * @param {Object} user - Objeto do usuário { name, email, password }
 * @returns {Promise<Object>} Dados do usuário registrado
 */
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

/**
 * Realiza login de usuário existente.
 * @param {Object} user - Objeto do usuário { email, password }
 * @returns {Promise<Object>} Dados do usuário logado, token JWT, etc.
 */
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
