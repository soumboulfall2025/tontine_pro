import axios from "axios";

const API_URL = "https://tontine-pro-server.onrender.com/api";

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
export const getMembers = async (tontineId) => {
  const url = tontineId ? `${API_URL}/members?tontine=${tontineId}` : `${API_URL}/members`;
  const res = await axios.get(url);
  return res.data;
};

export const addMember = async (member, tontineId) => {
  const res = await axios.post(`${API_URL}/members`, { ...member, tontine: tontineId });
  return res.data;
};

export const deleteMember = async (memberId) => {
  const res = await axios.delete(`${API_URL}/members/${memberId}`);
  return res.data;
};

// --- Dettes ---
export const getDebts = async (tontineId) => {
  const url = tontineId ? `${API_URL}/debts?tontine=${tontineId}` : `${API_URL}/debts`;
  const res = await axios.get(url);
  return res.data;
};

export const addDebt = async (debt, tontineId) => {
  const res = await axios.post(`${API_URL}/debts`, { ...debt, tontine: tontineId });
  return res.data;
};

export const getDebtsByMember = async (memberId) => {
  const res = await axios.get(`${API_URL}/debts/member/${memberId}`);
  return res.data;
};

export const markDebtPaid = async (debtId, paidBy) => {
  const res = await axios.patch(`${API_URL}/debts/${debtId}/pay`, { paidBy });
  return res.data;
};

export const deleteDebt = async (debtId) => {
  const res = await axios.delete(`${API_URL}/debts/${debtId}`);
  return res.data;
};

// --- Tontines ---
export const getTontines = async () => {
  const res = await axios.get(`${API_URL}/tontines/mine`);
  return res.data;
};

export const createTontine = async (data) => {
  const res = await axios.post(`${API_URL}/tontines`, data);
  return res.data;
};

export const joinTontine = async (id) => {
  const res = await axios.post(`${API_URL}/tontines/${id}/join`);
  return res.data;
};

export const generateInviteLink = async (tontineId) => {
  const res = await axios.post(`${API_URL}/tontines/${tontineId}/invite`);
  return res.data.inviteUrl;
};
