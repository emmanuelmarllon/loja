import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

/**
 * Componente de rota privada
 * @param {ReactNode} children - Componentes que serão renderizados se o usuário estiver autorizado
 * @param {boolean} adminOnly - Se true, apenas admins podem acessar
 */
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  // Não logado → redireciona pro home
  if (!user) return <Navigate to="/" />;

  // Rota apenas para admins → se não for admin, manda pro 404
  if (adminOnly && !user.isAdmin) return <Navigate to="/404" />;

  // Usuário autorizado → renderiza a rota
  return <>{children}</>;
};

export default PrivateRoute;
