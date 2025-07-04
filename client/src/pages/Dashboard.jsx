import { useEffect, useState } from "react";
import { getMembers, getDebts } from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import DashboardCards from "../components/DashboardCards";
import RecentDebtsTable from "../components/RecentDebtsTable";

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const totalPaid = debts.filter((d) => d.status === "payée").reduce((sum, d) => sum + d.amount, 0);
  const totalUnpaid = debts.filter((d) => d.status === "non payée").reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full h-full min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 bg-light-gray w-full h-full min-h-screen">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Chargement...</div>
          ) : (
            <>
              <DashboardCards paid={totalPaid} unpaid={totalUnpaid} members={members.length} />
              <RecentDebtsTable debts={debts.slice(0, 5).map(d => ({
                client: members.find(m => m._id === d.member)?.name || "-",
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
