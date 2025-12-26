// src/components/admin/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Bell, Images } from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="w-60 bg-blue-900 text-white min-h-screen p-4">
      {/* Logo + Title */}
      <div className="flex flex-col items-center border-b border-blue-500 pb-4">
        <img
          src="/logo.png"
          alt="logo"
          className="w-14 h-14 rounded-full border my-2"
        />
        <h1 className="text-lg font-bold text-center">G.L.M. COLLEGE</h1>
      </div>

      <nav className="flex flex-col gap-1 mt-4 text-sm">
        <NavLink
          to="/admin/dashboard"
          className="flex items-center gap-2 py-2 px-3 hover:bg-blue-700 rounded"
        >
          <LayoutDashboard size={18} /> Home
        </NavLink>

        <NavLink
          to="/admin/notification"
          className="flex items-center gap-2 py-2 px-3 hover:bg-blue-700 rounded"
        >
          <Bell size={18} /> Notification
        </NavLink>

        <NavLink
          to="/admin/gallery"
          className="flex items-center gap-2 py-2 px-3 hover:bg-blue-700 rounded"
        >
          <Images size={18} /> Gallery
        </NavLink>
      </nav>
    </aside>
  );
}
