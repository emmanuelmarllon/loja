import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    // mantém compatibilidade
    req.userId = payload.userId;

    // só pros controllers de review, você pode acessar req.user.id
    req.user = { id: payload.userId };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
