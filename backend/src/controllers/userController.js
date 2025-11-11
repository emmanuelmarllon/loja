import { registerUser, loginUser, getMe } from "../services/userService.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const data = await registerUser(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const data = await loginUser(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ME
export const me = async (req, res) => {
  try {
    const data = await getMe(req.userId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
