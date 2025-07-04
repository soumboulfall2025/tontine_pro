import React, { useState } from "react";

const AddDebtModal = ({ members, onAdd, onClose, show }) => {
  const [form, setForm] = useState({ client: "", amount: "", description: "", date: "", status: "non payée" });

  if (!show) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">Ajouter une dette</h2>
        <select name="client" value={form.client} onChange={handleChange} required className="p-2 rounded border">
          <option value="">Sélectionner un client</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <input name="amount" type="number" placeholder="Montant" value={form.amount} onChange={handleChange} required className="p-2 rounded border" />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="p-2 rounded border" />
        <input name="date" type="date" value={form.date} onChange={handleChange} required className="p-2 rounded border" />
        <select name="status" value={form.status} onChange={handleChange} className="p-2 rounded border">
          <option value="payée">Payée</option>
          <option value="non payée">Non payée</option>
        </select>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Ajouter</button>
          <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg">Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default AddDebtModal;
