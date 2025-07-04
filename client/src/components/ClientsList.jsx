import React from "react";
import { useNavigate } from "react-router-dom";

const ClientsList = ({ members }) => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((m) => (
        <div key={m._id || m.id} className="flex items-center bg-white rounded-xl shadow p-4 gap-4">
          <img src={m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}`} alt={m.name} className="w-12 h-12 rounded-full object-cover border-2 border-green-400" />
          <div className="flex-1">
            <div className="font-bold text-lg">{m.name}</div>
            <div className="text-gray-500 text-sm">{m.phone}</div>
          </div>
          <button onClick={() => navigate(`/clients?member=${m._id || m.id}`)} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition">Voir dettes</button>
        </div>
      ))}
    </div>
  );
};

export default ClientsList;
