import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { getMembers, addMember } from "../api";

const Members = ({ showToast }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", avatar: "" });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const m = await getMembers();
    setMembers(m);
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMember(form);
      setShowModal(false);
      setForm({ name: "", phone: "", avatar: "" });
      fetchMembers();
      if (showToast) showToast("Membre ajouté avec succès", "success");
    } catch (err) {
      if (showToast) showToast("Erreur lors de l'ajout du membre", "error");
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full h-full min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 bg-light-gray w-full h-full min-h-screen">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Membres</h1>
            {isAdmin && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Ajouter un membre
              </button>
            )}
          </div>
          {loading ? (
            <div className="text-center py-10 text-gray-500">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center bg-white rounded-xl shadow p-4 gap-4"
                >
                  <img
                    src={
                      m.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        m.name
                      )}`
                    }
                    alt={m.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-green-400"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-lg">{m.name}</div>
                    <div className="text-gray-500 text-sm">{m.phone}</div>
                    <button
                      className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      onClick={() => (window.location.href = `/clients?member=${m._id}`)}
                    >
                      Voir dettes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <BottomNav />
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col gap-4"
            >
              <h2 className="text-xl font-bold mb-2">Ajouter un membre</h2>
              <input
                name="name"
                placeholder="Nom"
                value={form.name}
                onChange={handleChange}
                required
                className="p-2 rounded border"
              />
              <input
                name="phone"
                placeholder="Téléphone"
                value={form.phone}
                onChange={handleChange}
                required
                className="p-2 rounded border"
              />
              <input
                name="avatar"
                placeholder="URL Avatar (optionnel)"
                value={form.avatar}
                onChange={handleChange}
                className="p-2 rounded border"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
