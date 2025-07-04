import axios from "axios";

const API_URL = "http://localhost:5000/api";

// --- Gestion du token JWT ---
export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

// Intercepteur pour ajouter le token à chaque requête protégée
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Authentification ---
export const login = async (credentials) => {
  const res = await axios.post(`${API_URL}/auth/login`, credentials);
  if (res.data.token) setToken(res.data.token);
  return res.data;
};

export const logout = () => {
  removeToken();
};

export const isAuthenticated = () => !!getToken();

// --- Membres ---
export const getMembers = async () => {
  const res = await axios.get(`${API_URL}/members`);
  return res.data;
};

export const addMember = async (member) => {
  const res = await axios.post(`${API_URL}/members`, member);
  return res.data;
};

// --- Dettes ---
export const getDebts = async () => {
  const res = await axios.get(`${API_URL}/debts`);
  return res.data;
};

export const addDebt = async (debt) => {
  const res = await axios.post(`${API_URL}/debts`, debt);
  return res.data;
};

export const getDebtsByMember = async (memberId) => {
  const res = await axios.get(`${API_URL}/debts/member/${memberId}`);
  return res.data;
};

export const markDebtPaid = async (debtId) => {
  const res = await axios.patch(`${API_URL}/debts/${debtId}/pay`);
  return res.data;
};
