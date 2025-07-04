import React from "react";

const DashboardCards = ({ paid, unpaid, members }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card color="green" title="Total dettes payées" value={paid} />
      <Card color="red" title="Total dettes impayées" value={unpaid} />
      <Card color="yellow" title="Total membres" value={members} />
    </div>
  );
};

const Card = ({ color, title, value }) => {
  const colorMap = {
    green: "bg-green-100 text-green-700 border-green-400",
    red: "bg-red-100 text-red-700 border-red-400",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-400",
  };
  return (
    <div className={`rounded-xl shadow border-l-8 p-5 flex flex-col gap-2 ${colorMap[color]}`}> 
      <span className="text-lg font-semibold">{title}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
};

export default DashboardCards;
