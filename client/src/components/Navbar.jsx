import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full flex items-center justify-between px-4 py-2 bg-white shadow-md rounded-b-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-green-600">TontinePro</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-gray-100 rounded-full p-2 hover:bg-gray-200">
          <span className="material-icons text-gray-700">account_circle</span>
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition hidden md:inline"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
