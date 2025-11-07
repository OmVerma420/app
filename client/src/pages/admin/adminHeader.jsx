// src/components/admin/AdminHeader.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogout } from "@/store/adminAuthSlice";

export default function AdminHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-blue-900 text-white flex justify-between items-center px-6 py-4 shadow">
      <h2
        className="font-bold text-lg cursor-pointer"
        onClick={() => navigate("/admin/dashboard")}
      >
        GORELAL MEHTA COLLEGE
      </h2>

      <nav className="flex items-center gap-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="hover:text-yellow-300"
        >
          Dashboard
        </button>

        {/* CLC MENU */}
        <div className="relative">
          <button
            className="hover:text-yellow-300"
            onClick={() => setOpen(!open)}
          >
            CLC ▼
          </button>

          {open && (
            <div className="absolute right-0 bg-white text-black rounded shadow-md w-40">
              <p
                onClick={() => navigate("/admin/clc")}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                CLC Dashboard
              </p>
              <p
                onClick={() => navigate("/admin/clc/search")}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                Search CLC
              </p>
              <p
                onClick={() => navigate("/admin/clc/records")}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                Apply Records
              </p>
            </div>
          )}
        </div>

        <button
          className="bg-red-600 hover:bg-red-800 px-4 py-2 rounded"
          onClick={() => dispatch(adminLogout())}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
