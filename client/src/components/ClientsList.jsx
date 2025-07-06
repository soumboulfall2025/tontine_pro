import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteMember, addMember } from "../api";
import axios from "axios";
import { FaTrash, FaPlus, FaUser, FaHistory } from "react-icons/fa";

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

const SmsModal = ({ open, onClose, member }) => {
  const [message, setMessage] = useState(`Bonjour ${member?.name}, merci de penser à votre cotisation.`);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  if (!open) return null;
  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post("/api/sms/send", { to: member.phone, message });
      setSuccess("SMS envoyé !");
    } catch (err) {
      setError("Erreur lors de l'envoi du SMS");
    }
    setLoading(false);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form onSubmit={handleSend} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-sm flex flex-col gap-4">
        <div className="text-lg font-bold text-center">Envoyer un rappel</div>
        <div className="text-sm text-gray-700 dark:text-gray-200 text-center">
          À : <b>{member?.name}</b> ({member?.phone})
        </div>
        <textarea value={message} onChange={e => setMessage(e.target.value)} className="p-2 rounded border" rows={3} required />
        {success && <div className="text-green-600 text-center">{success}</div>}
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div className="flex gap-2 justify-center mt-2">
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg button-hover" disabled={loading}>
            {loading ? "Envoi..." : "Envoyer"}
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
  const [smsModal, setSmsModal] = useState({ open: false, member: null });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";
  const filtered = localMembers.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.toLowerCase().includes(search.toLowerCase())
  );

  // Détection de la disponibilité WhatsApp (Twilio)
  const whatsappEnabled = !!process.env.REACT_APP_TWILIO_WHATSAPP_ENABLED;
  // Détection de la disponibilité SMS (Twilio ou autre)
  const smsEnabled = !!process.env.REACT_APP_TWILIO_SMS_ENABLED;

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
      // Récupérer la tontine sélectionnée depuis le localStorage
      const t = localStorage.getItem("selectedTontine");
      const tontineId = t ? JSON.parse(t)._id : null;
      if (!tontineId) throw new Error("Aucune tontine sélectionnée");
      // Appeler addMember avec la tontine sélectionnée
      const newMember = await addMember(data, tontineId);
      setLocalMembers((prev) => [...prev, newMember]);
    } catch (err) {
      alert("Erreur lors de l'ajout du membre");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Message d'info admin si WhatsApp non dispo */}
      {isAdmin && !whatsappEnabled && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded text-center">
          ⚠️ La fonctionnalité WhatsApp n'est pas disponible (Twilio non configuré).
        </div>
      )}
      {/* Message d'info admin si SMS non dispo */}
      {isAdmin && !smsEnabled && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded text-center">
          ⚠️ La fonctionnalité SMS n'est pas disponible (aucun service SMS configuré).
        </div>
      )}
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
              className="bg-blue-500 text-white px-4 py-2 rounded-lg button-hover flex items-center gap-2"
            >
              <FaHistory /> Mon historique
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setAddModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg button-hover flex items-center gap-2"
            >
              <FaPlus /> Ajouter un membre
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
              className="bg-green-500 text-white px-3 py-1 rounded-lg button-hover flex items-center gap-2"
            >
              <FaUser /> Voir dettes
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg button-hover ml-2 flex items-center gap-2"
                  disabled={loading}
                >
                  <FaTrash className="text-lg text-red-700" />
                  <span className="hidden md:inline">Supprimer</span>
                </button>
                {/* Boutons rappel désactivés */}
                {/*
                <button
                  onClick={() => setSmsModal({ open: true, member: m })}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg button-hover ml-2"
                >
                  Envoyer rappel
                </button>
                <button
                  onClick={() => {}}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg button-hover ml-2"
                >
                  WhatsApp
                </button>
                */}
              </>
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
      <SmsModal open={smsModal.open} onClose={() => setSmsModal({ open: false, member: null })} member={smsModal.member} />
    </>
  );
};

export default ClientsList;
