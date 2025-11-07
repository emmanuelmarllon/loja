import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

/**
 * Componente de rota privada
 * @param {ReactNode} children - Componentes que serão renderizados se o usuário estiver autorizado
 * @param {boolean} adminOnly - Se true, apenas admins podem acessar
 */
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  // Redireciona se não estiver logado
  if (!user) return <Navigate to="/" />;

  // Redireciona se rota for apenas para admins e usuário não for admin
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;

  // Usuário autorizado, renderiza os children
  return children;
};

export default PrivateRoute;
