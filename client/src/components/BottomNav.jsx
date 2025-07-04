import React from "react";
import { FaHome, FaUsers, FaMoneyBillWave, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logout } from "../api";

const BottomNav = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center bg-white shadow-t px-2 py-2 md:hidden z-50">
      <NavItem icon={<FaHome />} label="Accueil" onClick={() => navigate("/")} />
      <NavItem icon={<FaUsers />} label="Clients" onClick={() => navigate("/clients")} />
      <NavItem icon={<FaUsers />} label="Membres" onClick={() => navigate("/members")} />
      <NavItem icon={<FaMoneyBillWave />} label="Dettes" onClick={() => navigate("/debts")} />
      <NavItem icon={<FaCog />} label="Paramètres" onClick={() => navigate("/settings")} />
      <NavItem icon={<FaSignOutAlt />} label="Déconnexion" onClick={handleLogout} />
    </nav>
  );
};

const NavItem = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center text-green-600 hover:text-green-800 transition">
    <span className="text-2xl">{icon}</span>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export default BottomNav;
