import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, isAuthenticated } from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await login({ email, password });
      if (res.token) {
        // Le token est déjà stocké par la fonction login (api.js)
        if (res.user) {
          localStorage.setItem("user", JSON.stringify(res.user));
        } else if (res.role) {
          localStorage.setItem("user", JSON.stringify({ role: res.role }));
        }
        setSuccess("Connexion réussie ! Redirection...");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setError("Token manquant, connexion impossible.");
      }
    } catch (err) {
      console.log('Erreur API:', err.response?.data);
      setError(err.response?.data?.message || JSON.stringify(err.response?.data) || "Erreur de connexion");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100 dark:bg-green-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-green-200 dark:border-green-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700 dark:text-green-300">Connexion</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-semibold dark:text-gray-200">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-500 bg-green-50 dark:bg-green-800 text-gray-900 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold dark:text-gray-200">Mot de passe</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-500 bg-green-50 dark:bg-green-800 text-gray-900 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-semibold shadow-md"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
