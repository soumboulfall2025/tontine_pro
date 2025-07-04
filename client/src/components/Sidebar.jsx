import React from "react";
import { FaHome, FaUsers, FaMoneyBillWave, FaChartBar, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";
  return (
    <aside className="hidden md:flex flex-col w-56 h-full min-h-screen bg-white shadow-lg rounded-r-3xl py-8 px-4 gap-6">
      <div className="flex flex-col gap-4">
        <SidebarItem icon={<FaHome />} label="Tableau de bord" onClick={() => navigate("/")} />
        <SidebarItem icon={<FaUsers />} label="Clients" onClick={() => navigate("/clients")} />
        {isAdmin && (
          <SidebarItem icon={<FaUsers />} label="Membres" onClick={() => navigate("/members")} />
        )}
        <SidebarItem icon={<FaMoneyBillWave />} label="Dettes / Cotisations" onClick={() => navigate("/debts")} />
        <SidebarItem icon={<FaChartBar />} label="Rapports" onClick={() => navigate("/reports")} />
        <SidebarItem icon={<FaCog />} label="Paramètres" onClick={() => navigate("/settings")} />
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 text-lg font-medium transition w-full text-left">
    <span className="text-green-600 text-xl">{icon}</span>
    {label}
  </button>
);

export default Sidebar;
