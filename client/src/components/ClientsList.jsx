import React from "react";

const ClientsList = ({ members, onViewDebts }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {members.map((m) => (
      <div key={m.id} className="flex items-center bg-white rounded-xl shadow p-4 gap-4">
        <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-full object-cover border-2 border-green-400" />
        <div className="flex-1">
          <div className="font-bold text-lg">{m.name}</div>
          <div className="text-gray-500 text-sm">{m.phone}</div>
        </div>
        <button onClick={() => onViewDebts(m.id)} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition">Voir dettes</button>
      </div>
    ))}
  </div>
);

export default ClientsList;
