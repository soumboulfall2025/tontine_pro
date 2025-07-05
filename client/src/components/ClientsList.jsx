import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteMember, addMember } from "../api";

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const ConfirmModal = ({ open, onConfirm, onCancel, message }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-sm flex flex-col gap-4">
        <div className="text-lg font-bold text-center">Confirmation</div>
        <div className="text-center">{message}</div>
        <div className="flex gap-2 justify-center mt-2">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-lg button-hover"
          >
            Confirmer
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg button-hover"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

const AddMemberModal = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "member",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  if (!open) return null;
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onAdd(form);
      onClose();
      setForm({ name: "", email: "", phone: "", password: "", role: "member" });
    } catch (err) {
      setError("Erreur lors de l'ajout du membre");
    }
    setLoading(false);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-sm flex flex-col gap-4">
        <div className="text-lg font-bold text-center">Ajouter un membre</div>
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Nom" className="p-2 rounded border" />
        <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Email" className="p-2 rounded border" />
        <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Téléphone" className="p-2 rounded border" />
        <input name="password" value={form.password} onChange={handleChange} required type="password" placeholder="Mot de passe" className="p-2 rounded border" />
        <select name="role" value={form.role} onChange={handleChange} className="p-2 rounded border">
          <option value="member">Membre</option>
          <option value="admin">Admin</option>
        </select>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <div className="flex gap-2 justify-center mt-2">
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg button-hover" disabled={loading}>
            {loading ? "Ajout..." : "Ajouter"}
          </button>
          <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg button-hover">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

const ClientsList = ({ members }) => {
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [addModal, setAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localMembers, setLocalMembers] = useState(members);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";
  const filtered = localMembers.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setConfirm({ open: true, id });
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await deleteMember(confirm.id);
      setLocalMembers((prev) => prev.filter((m) => m._id !== confirm.id));
      setConfirm({ open: false, id: null });
    } catch (err) {
      setConfirm({ open: false, id: null });
      alert("Erreur lors de la suppression du membre");
    }
    setLoading(false);
  };

  const handleAddMember = async (data) => {
    setLoading(true);
    try {
      const newMember = await addMember(data);
      setLocalMembers((prev) => [...prev, newMember]);
    } catch (err) {
      alert("Erreur lors de l'ajout du membre");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <input
          type="text"
          placeholder="Rechercher un membre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-2 rounded border focus:outline-none focus:ring"
        />
        {/* Bouton Mon historique pour le membre connecté */}
        <div className="flex gap-2 mt-2 md:mt-0">
          {user && (
            <button
              onClick={() => navigate(`/clients?member=${user._id || user.id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg button-hover"
            >
              Mon historique
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setAddModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg button-hover"
            >
              Ajouter un membre
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m) => (
          <div
            key={m._id || m.id}
            className="flex items-center bg-white rounded-xl shadow p-4 gap-4 card-hover"
          >
            {m.avatar ? (
              <img
                src={m.avatar}
                alt={m.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-green-400"
              />
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-700 font-bold text-xl border-2 border-green-400">
                {getInitials(m.name)}
              </div>
            )}
            <div className="flex-1">
              <div className="font-bold text-lg flex items-center gap-2">
                {m.name}
                {m.role === "admin" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-200 text-green-800 dark:bg-green-700 dark:text-white font-bold">
                    Admin
                  </span>
                )}
              </div>
              <div className="text-gray-500 text-sm">{m.phone}</div>
            </div>
            <button
              onClick={() => navigate(`/clients?member=${m._id || m.id}`)}
              className="bg-green-500 text-white px-3 py-1 rounded-lg button-hover"
            >
              Voir dettes
            </button>
            {isAdmin && (
              <button
                onClick={() => handleDelete(m._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg button-hover ml-2"
                disabled={loading}
              >
                Supprimer
              </button>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-400">
            Aucun membre trouvé
          </div>
        )}
      </div>
      <ConfirmModal
        open={confirm.open}
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
        message="Confirmer la suppression de ce membre ? Cette action est irréversible."
      />
      <AddMemberModal open={addModal} onClose={() => setAddModal(false)} onAdd={handleAddMember} />
    </>
  );
};

export default ClientsList;
