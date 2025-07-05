import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { getDebts, getMembers, addDebt, markDebtPaid, deleteDebt } from "../api";

const ConfirmModal = ({ open, onConfirm, onCancel, message }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-sm flex flex-col gap-4">
        <div className="text-lg font-bold text-center">Confirmation</div>
        <div className="text-center">{message}</div>
        <div className="flex gap-2 justify-center mt-2">
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded-lg button-hover">Confirmer</button>
          <button onClick={onCancel} className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg button-hover">Annuler</button>
        </div>
      </div>
    </div>
  );
};

const Debts = ({ showToast }) => {
  const [debts, setDebts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ member: "", amount: "", description: "", date: "", status: "non payée" });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ field: "date", dir: "desc" });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const [selectedTontine, setSelectedTontine] = useState(() => {
    const t = localStorage.getItem("selectedTontine");
    return t ? JSON.parse(t) : null;
  });

  useEffect(() => {
    if (!selectedTontine) return;
    setLoading(true);
    Promise.all([
      getDebts(selectedTontine._id),
      getMembers(selectedTontine._id)
    ]).then(([d, m]) => {
      setDebts(d);
      setMembers(m);
      setLoading(false);
    });
  }, [selectedTontine]);

  // Recherche/filtre
  const filtered = debts.filter(d => {
    const memberName = d.member?.name?.toLowerCase() || "";
    const paidByName = members.find(m => m._id === d.paidBy)?.name?.toLowerCase() || "";
    return (
      memberName.includes(search.toLowerCase()) ||
      paidByName.includes(search.toLowerCase()) ||
      (d.description || "").toLowerCase().includes(search.toLowerCase()) ||
      String(d.amount).includes(search)
    );
  });

  // Tri
  const sorted = [...filtered].sort((a, b) => {
    let v1, v2;
    switch (sort.field) {
      case "amount":
        v1 = a.amount; v2 = b.amount; break;
      case "status":
        v1 = a.status; v2 = b.status; break;
      case "date":
      default:
        v1 = new Date(a.date); v2 = new Date(b.date); break;
    }
    if (v1 < v2) return sort.dir === "asc" ? -1 : 1;
    if (v1 > v2) return sort.dir === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDebt(form, selectedTontine?._id);
      setShowModal(false);
      setForm({ member: "", amount: "", description: "", date: "", status: "non payée" });
      fetchData();
      if (showToast) showToast("Dette ajoutée avec succès", "success");
    } catch (err) {
      if (showToast) showToast("Erreur lors de l'ajout de la dette", "error");
    }
  };

  const handleMarkPaid = async (id) => {
    setConfirm({ open: true, id });
  };

  const confirmMarkPaid = async () => {
    try {
      await markDebtPaid(confirm.id);
      setConfirm({ open: false, id: null });
      fetchData();
      if (showToast) showToast("Dette marquée comme payée", "success");
    } catch (err) {
      setConfirm({ open: false, id: null });
      if (showToast) showToast("Erreur lors de la mise à jour", "error");
    }
  };

  const handleDelete = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const confirmDeleteDebt = async () => {
    try {
      await deleteDebt(confirmDelete.id);
      setConfirmDelete({ open: false, id: null });
      fetchData();
      if (showToast) showToast("Dette supprimée", "success");
    } catch (err) {
      setConfirmDelete({ open: false, id: null });
      if (showToast) showToast("Erreur lors de la suppression", "error");
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-screen overflow-x-hidden min-w-0 max-w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full h-full min-h-screen min-w-0 max-w-full">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 bg-light-gray w-full h-full min-h-screen max-w-full overflow-x-hidden">
          <div className="flex flex-col gap-4 w-full max-w-full overflow-x-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 w-full max-w-full overflow-x-hidden">
              <h1 className="text-2xl font-bold whitespace-nowrap">Dettes / Cotisations</h1>
              <input
                type="text"
                placeholder="Rechercher une dette..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full md:w-1/3 p-2 rounded border focus:outline-none focus:ring mt-2 md:mt-0"
              />
              {isAdmin && (
                <button onClick={() => setShowModal(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition whitespace-nowrap ml-0 md:ml-4 mt-2 md:mt-0">Ajouter une dette</button>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher par membre, montant, description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="p-2 rounded border w-full"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={sort.field}
                  onChange={(e) => setSort({ ...sort, field: e.target.value })}
                  className="p-2 rounded border"
                >
                  <option value="date">Trier par date</option>
                  <option value="amount">Trier par montant</option>
                  <option value="status">Trier par statut</option>
                </select>
                <select
                  value={sort.dir}
                  onChange={(e) => setSort({ ...sort, dir: e.target.value })}
                  className="p-2 rounded border"
                >
                  <option value="desc">Ordre décroissant</option>
                  <option value="asc">Ordre croissant</option>
                </select>
              </div>
            </div>
            {loading ? (
              <div className="text-center py-10 text-gray-500">Chargement...</div>
            ) : (
              <>
                {/* Affichage mobile : cartes */}
                <div className="block md:hidden space-y-4">
                  {paginated.map((d, i) => (
                    <div key={i} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-100 hover:shadow-lg transition cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">{d.member?.name || "-"}</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold 
                          ${d.status === 'payée' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.status}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{d.amount} FCFA</span>
                        <span>{new Date(d.date).toLocaleDateString()}</span>
                      </div>
                      <div className="text-gray-500 text-sm">{d.description}</div>
                      <span className="text-xs text-gray-500">Membre : {d.member?.name || "-"}</span>
                      {d.paidBy && (
                        <span className="text-xs text-gray-500">Payé par : {members.find(m => m._id === d.paidBy)?.name || "-"}</span>
                      )}
                      {isAdmin && d.status === 'non payée' && (
                        <button onClick={() => handleMarkPaid(d._id)} className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs w-fit self-end transition">Marquer comme payée</button>
                      )}
                    </div>
                  ))}
                </div>
                {/* Affichage desktop : tableau */}
                <div className="hidden md:block overflow-x-auto w-full max-w-full">
                  <table className="min-w-full bg-white rounded-xl shadow box-border table-fixed">
                    <colgroup>
                      <col className="w-2/12" />
                      <col className="w-2/12" />
                      <col className="w-2/12" />
                      <col className="w-2/12" />
                      <col className="w-2/12" />
                      <col className="w-2/12" />
                      {isAdmin && <col className="w-1/12" />}
                    </colgroup>
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="py-2 px-2 whitespace-nowrap cursor-pointer" onClick={() => setSort(s => ({ field: 'member', dir: s.dir === 'asc' ? 'desc' : 'asc' }))}>Membre</th>
                        <th className="py-2 px-2 whitespace-nowrap cursor-pointer" onClick={() => setSort(s => ({ field: 'amount', dir: s.dir === 'asc' ? 'desc' : 'asc' }))}>Montant</th>
                        <th className="py-2 px-2 whitespace-nowrap cursor-pointer" onClick={() => setSort(s => ({ field: 'date', dir: s.dir === 'asc' ? 'desc' : 'asc' }))}>Date</th>
                        <th className="py-2 px-2 whitespace-nowrap cursor-pointer" onClick={() => setSort(s => ({ field: 'status', dir: s.dir === 'asc' ? 'desc' : 'asc' }))}>Statut</th>
                        <th className="py-2 px-2 whitespace-nowrap">Description</th>
                        <th className="py-2 px-2 whitespace-nowrap">Payé par</th>
                        {isAdmin && <th className="py-2 px-2 whitespace-nowrap">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((d, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition cursor-pointer">
                          <td className="py-2 px-2 font-medium truncate">{members.find(m => m._id === d.member)?.name || "-"}</td>
                          <td className="py-2 px-2 truncate">{d.amount} FCFA</td>
                          <td className="py-2 px-2 truncate">{new Date(d.date).toLocaleDateString()}</td>
                          <td className="py-2 px-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold 
                              ${d.status === 'payée' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.status}</span>
                          </td>
                          <td className="py-2 px-2 truncate">{d.description}</td>
                          <td className="py-2 px-2 truncate">{members.find(m => m._id === d.paidBy)?.name || '-'}</td>
                          {isAdmin && (
                            <td className="py-2 px-2 flex gap-2">
                              {d.status === 'non payée' && (
                                <button onClick={() => handleMarkPaid(d._id)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs">Marquer comme payée</button>
                              )}
                              <button onClick={() => handleDelete(d._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs">Supprimer</button>
                            </td>
                          )}
                        </tr>
                      ))}
                      {paginated.length === 0 && (
                        <tr><td colSpan={isAdmin ? 7 : 6} className="text-center text-gray-400 py-4">Aucune dette trouvée</td></tr>
                      )}
                    </tbody>
                  </table>
                  {/* Pagination */}
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded bg-gray-200 button-hover disabled:opacity-50">Précédent</button>
                    <span className="text-sm">Page {page} / {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded bg-gray-200 button-hover disabled:opacity-50">Suivant</button>
                  </div>
                </div>
                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    Page {page} sur {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
                      disabled={page === 1}
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
                      disabled={page === totalPages}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
        <BottomNav />
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col gap-4">
              <h2 className="text-xl font-bold mb-2">Ajouter une dette</h2>
              <select name="member" value={form.member} onChange={handleChange} required className="p-2 rounded border">
                <option value="">Sélectionner un membre</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>{m.name}</option>
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
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-200 px-4 py-2 rounded-lg">Annuler</button>
              </div>
            </form>
          </div>
        )}
        <ConfirmModal
          open={confirm.open}
          onConfirm={confirmMarkPaid}
          onCancel={() => setConfirm({ open: false, id: null })}
          message="Confirmer le marquage de cette dette comme payée ?"
        />
        <ConfirmModal
          open={confirmDelete.open}
          onConfirm={confirmDeleteDebt}
          onCancel={() => setConfirmDelete({ open: false, id: null })}
          message="Confirmer la suppression de cette dette ? Cette action est irréversible."
        />
      </div>
    </div>
  );
};

export default Debts;
