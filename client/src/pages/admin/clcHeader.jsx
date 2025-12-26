// src/components/admin/AdminHeaderCLC.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogout } from "@/store/adminAuthSlice";
import { ChevronDown, LogOut } from "lucide-react";

export default function AdminHeaderCLC() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  /** ✅ Close dropdown when clicking outside */
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** ✅ Navigate + auto-close menu */
  const goTo = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <header className="bg-blue-900 text-white flex justify-between items-center px-6 py-3 shadow-md">
      {/* LOGO / HOME */}
      <h2
        className="font-bold text-xl cursor-pointer"
        onClick={() => goTo("/admin/dashboard")}
      >
        GORELAL MEHTA COLLEGE
      </h2>

      {/* NAV */}
      <nav className="flex items-center gap-6">
        <button
          onClick={() => goTo("/admin/dashboard")}
          className="hover:text-yellow-300 transition"
        >
          Dashboard
        </button>

        {/* CLC DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-1 hover:text-yellow-300 transition"
            onClick={() => setOpen(!open)}
          >
            CLC <ChevronDown size={16} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg border min-w-[160px] py-1 z-50">
              <button
                onClick={() => goTo("/admin/clc")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                CLC Dashboard
              </button>

              <button
                onClick={() => goTo("/admin/clc/search")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Search CLC
              </button>

              <button
                onClick={() => goTo("/admin/clc/records")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Apply Records
              </button>
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <button
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition"
          onClick={() => dispatch(adminLogout())}
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>
    </header>
  );
}
