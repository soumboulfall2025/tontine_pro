import { useEffect, useState } from "react";
import { getMembers, getDebts, getTontines, createTontine } from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import DashboardCards from "../components/DashboardCards";
import RecentDebtsTable from "../components/RecentDebtsTable";
import Spinner from "../components/Spinner";
import { FaPlus, FaWhatsapp } from "react-icons/fa";

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [debts, setDebts] = useState([]);
  const [tontines, setTontines] = useState([]);
  const [selectedTontine, setSelectedTontine] = useState(() => {
    const t = localStorage.getItem("selectedTontine");
    return t ? JSON.parse(t) : null;
  });
  const [tontineModal, setTontineModal] = useState(false);
  const [newTontine, setNewTontine] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [tontineLoading, setTontineLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const m = await getMembers();
      const d = await getDebts();
      setMembers(m);
      setDebts(d);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTontines = async () => {
      try {
        const t = await getTontines();
        setTontines(t);
        if (t.length > 0 && !selectedTontine) setSelectedTontine(t[0]);
      } catch {}
    };
    fetchTontines();
  }, []);

  useEffect(() => {
    if (!selectedTontine) return;
    setLoading(true);
    Promise.all([
      getMembers(selectedTontine._id),
      getDebts(selectedTontine._id)
    ]).then(([m, d]) => {
      setMembers(m);
      setDebts(d);
      setLoading(false);
    });
  }, [selectedTontine]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (selectedTontine) {
      localStorage.setItem("selectedTontine", JSON.stringify(selectedTontine));
    }
  }, [selectedTontine]);

  const handleSelectTontine = (id) => {
    const t = tontines.find(t => t._id === id);
    setSelectedTontine(t);
  };

  const handleCreateTontine = async (e) => {
    e.preventDefault();
    setTontineLoading(true);
    setError("");
    try {
      const t = await createTontine(newTontine);
      setTontines(prev => [...prev, t]);
      setSelectedTontine(t);
      setTontineModal(false);
      setNewTontine({ name: "", description: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de la création de la tontine");
    }
    setTontineLoading(false);
  };

  const totalPaid = debts.filter((d) => d.status === "payée").reduce((sum, d) => sum + d.amount, 0);
  const totalUnpaid = debts.filter((d) => d.status === "non payée").reduce((sum, d) => sum + d.amount, 0);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";

  // Résumé personnalisé pour le membre connecté
  let myDebts = [];
  let myPaid = 0;
  let myUnpaid = 0;
  if (user && !isAdmin) {
    myDebts = debts.filter(d => d.member?._id === user._id || d.member === user._id);
    myPaid = myDebts.filter(d => d.status === "payée").reduce((sum, d) => sum + d.amount, 0);
    myUnpaid = myDebts.filter(d => d.status === "non payée").reduce((sum, d) => sum + d.amount, 0);
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-screen overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full h-full min-h-screen min-w-0">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        {/* Sélecteur de tontine */}
        <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <div className="flex-1">
            <span className="font-bold text-[#008037]">Tontine sélectionnée :</span>
            <select
              value={selectedTontine?._id || ""}
              onChange={e => handleSelectTontine(e.target.value)}
              className="ml-2 p-2 rounded border"
            >
              {tontines.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
            {isAdmin && (
              <button
                onClick={() => setTontineModal(true)}
                className="ml-4 px-3 py-1 rounded bg-[#008037] text-white font-bold button-hover flex items-center gap-2"
              >
                <FaPlus /> Nouvelle tontine
              </button>
            )}
          </div>
          {selectedTontine && <div className="text-gray-600 dark:text-gray-300 text-sm">{selectedTontine.description}</div>}
          {isAdmin && selectedTontine && (
            <button
              onClick={async () => {
                try {
                  const url = await window.generateInviteLink(selectedTontine._id);
                  const whatsappMsg = encodeURIComponent(`Rejoins ma tontine "${selectedTontine.name}" sur Tontine Pro ! Clique ici : ${url}`);
                  window.open(`https://wa.me/?text=${whatsappMsg}`, '_blank');
                } catch (e) {
                  alert("Erreur lors de la génération du lien d'invitation");
                }
              }}
              className="ml-2 px-3 py-1 rounded bg-green-600 text-white font-bold button-hover flex items-center gap-2"
            >
              <FaWhatsapp className="text-xl" /> Inviter via WhatsApp
            </button>
          )}
        </div>
        {/* Modale création tontine */}
        {tontineModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form onSubmit={handleCreateTontine} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-sm flex flex-col gap-4">
              <div className="text-lg font-bold text-center">Créer une nouvelle tontine</div>
              {error && <div className="text-red-600 text-center text-sm font-bold">{error}</div>}
              <input value={newTontine.name} onChange={e => setNewTontine({ ...newTontine, name: e.target.value })} required placeholder="Nom de la tontine" className="p-2 rounded border" />
              <textarea value={newTontine.description} onChange={e => setNewTontine({ ...newTontine, description: e.target.value })} placeholder="Description (optionnelle)" className="p-2 rounded border" rows={2} />
              <div className="flex gap-2 justify-center mt-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg button-hover" disabled={tontineLoading}>{tontineLoading ? "Création..." : "Créer"}</button>
                <button type="button" onClick={() => setTontineModal(false)} className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg button-hover">Annuler</button>
              </div>
            </form>
          </div>
        )}
        <main className="flex-1 p-4 md:p-8 bg-light-gray w-full h-full min-h-screen max-w-full dark:bg-gray-900 transition-colors duration-300">
          {user && !isAdmin && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="font-bold text-lg">Résumé de mes dettes</div>
              <div className="flex gap-6">
                <div className="flex flex-col items-center"><span className="text-sm">Total</span><span className="font-bold text-xl">{myDebts.reduce((sum, d) => sum + d.amount, 0)} FCFA</span></div>
                <div className="flex flex-col items-center"><span className="text-sm">Payées</span><span className="font-bold text-xl text-green-600">{myPaid} FCFA</span></div>
                <div className="flex flex-col items-center"><span className="text-sm">Impayées</span><span className="font-bold text-xl text-red-600">{myUnpaid} FCFA</span></div>
              </div>
            </div>
          )}
          {loading ? (
            <div className="spinner-center"><Spinner size={48} color={darkMode ? '#fff' : '#6366f1'} /></div>
          ) : (
            <>
              <DashboardCards paid={totalPaid} unpaid={totalUnpaid} members={members.length} />
              <RecentDebtsTable debts={debts.slice(0, 5).map(d => ({
                client: d.member?.name || d.member?.email || d.member || "-",
                amount: d.amount,
                date: new Date(d.date).toLocaleDateString(),
                status: d.status,
              }))} />
            </>
          )}
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Dashboard;
