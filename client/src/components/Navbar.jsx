import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api";

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    if (showProfile) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full flex items-center justify-between px-4 py-2 bg-white shadow-md rounded-b-lg dark:bg-gray-900 dark:text-white">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
          TontinePro
        </span>
      </div>
      <div className="flex items-center gap-4">
        {/* Profil utilisateur (avatar + popover) */}
        {user && (
          <div className="relative" ref={profileRef}>
            <button
              className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center w-10 h-10 border-2 border-green-400"
              aria-label="Profil"
              onClick={() => setShowProfile((v) => !v)}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-green-700 font-bold text-lg">
                  {getInitials(user.name)}
                </span>
              )}
            </button>
            {showProfile && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 z-50 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-3 justify-center sm:justify-start">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-green-400" />
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-700 font-bold text-xl border-2 border-green-400">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-lg text-center sm:text-left">{user.name}</div>
                    <div className="text-xs px-2 py-0.5 rounded-full font-bold inline-block mt-1 "
                      style={{ background: user.role === "admin" ? "#bbf7d0" : "#e5e7eb", color: user.role === "admin" ? "#166534" : "#374151" }}>
                      {user.role}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-200 mb-1 text-center sm:text-left"><b>Email :</b> {user.email || <span className="italic text-gray-400">Non renseigné</span>}</div>
                <div className="text-sm text-gray-700 dark:text-gray-200 mb-3 text-center sm:text-left"><b>Téléphone :</b> {user.phone || <span className="italic text-gray-400">Non renseigné</span>}</div>
                <button
                  className="w-full bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition button-hover mt-2"
                  onClick={handleLogout}
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        )}
        {/* Switch mode */}
        <button
          className="bg-gray-200 dark:bg-gray-700 rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          aria-label="Mode sombre/clair"
          onClick={() => setDarkMode && setDarkMode((v) => !v)}
        >
          <span className="material-icons text-gray-700 dark:text-yellow-300">
            {darkMode ? "light_mode" : "dark_mode"}
          </span>
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition hidden md:inline button-hover"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
