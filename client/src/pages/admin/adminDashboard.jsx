// src/pages/admin/AdminDashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCLCStats } from "@/store/adminAuthSlice";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { stats, status } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    dispatch(getCLCStats());
  }, [dispatch]);

  const box = (text, color, path) => (
    <div
      onClick={() => path && navigate(path)}
      className={`cursor-pointer text-white font-semibold text-center py-6 rounded-lg shadow-lg hover:scale-105 transition ${
        color === "blue"
          ? "bg-blue-600"
          : color === "red"
          ? "bg-red-500"
          : "bg-yellow-500"
      }`}
    >
      {text}
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">G.L.M. College</h1>

      {/* SECTION 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {box("UG Sem-I", "blue")}
        {box("UG Sem-II", "blue")}
        {box("UG Sem-III", "blue")}
        {box("UG Sem-IV", "blue")}
      </div>

      {/* SECTION 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {box("UG Part-I", "red")}
        {box("UG Part-II", "red")}
        {box("UG Part-III", "red")}
      </div>

      {/* SECTION 3 */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        {box("Inter 11th Admission", "yellow")}
        {box("Inter 11th Registration", "yellow")}
      </div>

      {/* SECTION 4 */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        {box("Inter 12th Admission", "blue")}
        {/* ✅ CLC Button */}
        {box("CLC", "blue", "/admin/clc")}
      </div>
    </div>
  );
}
