import { useEffect, useState } from "react";
import { getMembers, getDebts } from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import DashboardCards from "../components/DashboardCards";
import RecentDebtsTable from "../components/RecentDebtsTable";
import Spinner from "../components/Spinner";

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

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
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

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
                client: d.member?.name || "-",
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
