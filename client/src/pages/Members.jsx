import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { getMembers } from "../api";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Members = ({ showToast }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTontine, setSelectedTontine] = useState(() => {
    const t = localStorage.getItem("selectedTontine");
    return t ? JSON.parse(t) : null;
  });

  useEffect(() => {
    if (!selectedTontine) return;
    setLoading(true);
    getMembers(selectedTontine._id).then((m) => {
      setMembers(m);
      setLoading(false);
    });
  }, [selectedTontine]);

  const sendManualReminder = async (member) => {
    try {
      await axios.post("/api/sms/send", {
        to: member.phone,
        message: `Rappel: Vous avez une ou plusieurs dettes à régler dans la tontine ${selectedTontine?.name}. Merci de vérifier votre espace membre.`,
      });
      if (showToast) showToast("Rappel SMS envoyé !", "success");
    } catch (err) {
      if (showToast) showToast("Erreur lors de l'envoi du rappel", "error");
    }
  };

  const sendManualWhatsApp = async (member) => {
    try {
      await axios.post("/api/whatsapp/send", {
        to: member.phone,
        message: `Rappel WhatsApp: Vous avez une ou plusieurs dettes à régler dans la tontine ${selectedTontine?.name}. Merci de vérifier votre espace membre.`,
      });
      if (showToast) showToast("Rappel WhatsApp envoyé !", "success");
    } catch (err) {
      if (showToast) showToast("Erreur lors de l'envoi du WhatsApp", "error");
    }
  };

  // Export CSV des membres
  const exportMembersCSV = () => {
    if (!members.length) return;
    const header = ["Nom", "Téléphone", "Email", "Date de création"];
    const rows = members.map((m) => [
      m.name,
      m.phone || "",
      m.email || "",
      m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((x) => `"${x}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `membres_tontine_${selectedTontine?.name || ""}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export PDF des membres
  const exportMembersPDF = () => {
    if (!members.length) return;
    const doc = new jsPDF();
    doc.text(`Membres de la tontine : ${selectedTontine && selectedTontine.name ? selectedTontine.name : ''}`, 10, 10);
    window.jspdf_autotable.default(doc, {
      head: [["Nom", "Téléphone", "Email", "Date de création"]],
      body: members.map(m => [
        m.name,
        m.phone || "",
        m.email || "",
        m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""
      ]),
      startY: 20
    });
    doc.save(`membres_tontine_${selectedTontine && selectedTontine.name ? selectedTontine.name : ''}.pdf`);
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
              <>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm ml-2"
                  onClick={exportMembersCSV}
                >
                  Exporter CSV
                </button>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm ml-2"
                  onClick={exportMembersPDF}
                >
                  Exporter PDF
                </button>
              </>
            )}
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-col gap-4">
              {members.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center bg-white rounded-xl shadow p-4 gap-4"
                >
                  <img
                    src={
                      m.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}`
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
                    {isAdmin && (
                      <>
                        <button
                          className="mt-2 ml-2 bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 text-sm"
                          onClick={() => sendManualReminder(m)}
                        >
                          Envoyer rappel
                        </button>
                        <button
                          className="mt-2 ml-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                          onClick={() => sendManualWhatsApp(m)}
                        >
                          WhatsApp
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Members;
