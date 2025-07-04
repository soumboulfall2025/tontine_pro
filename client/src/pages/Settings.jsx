import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

const translations = {
  fr: {
    settings: "Paramètres",
    theme: "Thème",
    light: "Clair",
    dark: "Sombre",
    language: "Langue",
    save: "Enregistrer",
  },
  en: {
    settings: "Settings",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    language: "Language",
    save: "Save",
  },
};

const Settings = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "clair");
  const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.classList.remove("theme-clair", "theme-sombre");
    document.documentElement.classList.add(
      theme === "clair" ? "theme-clair" : "theme-sombre"
    );
    localStorage.setItem("theme", theme);
    localStorage.setItem("lang", lang);
  }, [theme, lang]);

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full h-full min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 bg-light-gray w-full h-full min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-xl shadow p-8 w-full max-w-lg flex flex-col gap-6">
            <h1 className="text-2xl font-bold mb-2">{t.settings}</h1>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-medium mb-1">{t.theme}</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="p-2 rounded border w-full"
                >
                  <option value="clair">{t.light}</option>
                  <option value="sombre">{t.dark}</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">{t.language}</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="p-2 rounded border w-full"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                onClick={() => {}}
              >
                {t.save}
              </button>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Settings;
