// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = React.memo(() => {
  const navigate = useNavigate();

  const ugSem = ["Sem-I", "Sem-II", "Sem-III", "Sem-IV"];
  const ugPart = ["Part-I", "Part-II", "Part-III"];
  const interItems = [
    "Inter 11th Admission",
    "Inter 11th Registration",
    "Inter 12th Admission",
    "Inter 12th Exam Form",
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">G.L.M. College</h1>

      {/* ✅ CLC BOX ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
        

        {ugSem.map((sem, i) => (
          <div
            key={i}
            onClick={() => navigate("/admin/clc")}
            className="cursor-pointer flex justify-center items-center h-28 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xl rounded-lg shadow-md"
          >
            UG <br /> {sem}
          </div>
        ))}
      </div>

      {/* ✅ UG PART */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {ugPart.map((part, i) => (
          <div
            key={i}
            className="cursor-pointer flex justify-center items-center h-28 bg-red-500 hover:bg-red-600 text-white font-semibold text-xl rounded-lg shadow-md"
          >
            UG <br /> {part}
          </div>
        ))}
      </div>

      {/* ✅ INTER */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {interItems.map((item, i) => (
          <div
            key={i}
            className={`cursor-pointer flex justify-center items-center h-28 rounded-lg shadow-md text-black font-semibold text-xl ${
              i < 4 ? "bg-yellow-400" : "bg-blue-600 text-white"
            }`}
          >
            {item}
          </div>
        ))}
        <div
          onClick={() => navigate("/admin/clc")}
          className="cursor-pointer flex justify-center items-center h-28 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xl rounded-lg shadow-md"
        >
          CLC
        </div>
      </div>
    </div>
  );
});

export default AdminDashboard;
