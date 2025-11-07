// src/components/admin/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileSearch, FileSpreadsheet } from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="w-60 bg-indigo-900 text-gray-100 min-h-screen p-4">
      <h1 className="text-lg font-bold mb-6">G.L.M. COLLEGE</h1>

      <nav className="flex flex-col gap-2">
        <NavLink
          to="/admin/dashboard"
          className="flex items-center gap-2 hover:bg-indigo-700 px-3 py-2 rounded"
        >
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink
          to="/admin/clc"
          className="flex items-center gap-2 hover:bg-indigo-700 px-3 py-2 rounded"
        >
          <FileSpreadsheet size={18} /> CLC Records
        </NavLink>

        <NavLink
          to="/admin/clc/search"
          className="flex items-center gap-2 hover:bg-indigo-700 px-3 py-2 rounded"
        >
          <FileSearch size={18} /> Search
        </NavLink>
      </nav>
    </aside>
  );
}
