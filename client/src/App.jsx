import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Members from "./pages/Members";
import Debts from "./pages/Debts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Toast from "./components/Toast";
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [toast, setToast] = useState({ message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 2500);
  };

  // Déconnexion auto après 30 min d'inactivité
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }, 30 * 60 * 1000); // 30 min
    };
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-light-gray overflow-x-hidden">
      <Router>
        <Routes>
          <Route path="/login" element={<Login showToast={showToast} />} />
          <Route path="/" element={<PrivateRoute><Dashboard showToast={showToast} /></PrivateRoute>} />
          <Route path="/clients" element={<PrivateRoute><Clients showToast={showToast} /></PrivateRoute>} />
          <Route path="/members" element={<PrivateRoute><Members showToast={showToast} /></PrivateRoute>} />
          <Route path="/debts" element={<PrivateRoute><Debts showToast={showToast} /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports showToast={showToast} /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings showToast={showToast} /></PrivateRoute>} />
        </Routes>
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: toast.type })} />
      </Router>
    </div>
  );
}

export default App;
