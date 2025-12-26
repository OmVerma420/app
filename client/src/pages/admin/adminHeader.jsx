// src/components/admin/AdminHeaderMain.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "@/store/adminAuthSlice";
import { LogOut } from "lucide-react";

export default function AdminHeaderMain() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector((s) => s.adminAuth.admin);

  return (
    <header className="bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">
      {/* LEFT: TITLE */}
      <h2
        className="font-bold text-2xl cursor-pointer text-blue-700"
        onClick={() => navigate("/admin/dashboard")}
      >
        G.L.M. College
      </h2>

      {/* RIGHT — ADMIN SECTION */}
      <div className="flex items-center gap-6">
        
        {/* Admin Name Display */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
            {admin?.name?.charAt(0) ?? "A"}
          </div>

          <div className="text-sm">
            <p className="font-medium">{admin?.name ?? "Administrator"}</p>
            <p className="text-gray-500 text-xs">{admin?.email ?? ""}</p>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition"
          onClick={() => dispatch(adminLogout())}
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
}
