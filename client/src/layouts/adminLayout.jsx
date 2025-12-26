// src/components/admin/AdminLayout.jsx
import React from "react";
import { useLocation } from "react-router-dom";

import AdminSidebar from "../pages/admin/adminSidebar.jsx";
import AdminHeaderMain from "../pages/admin/adminHeader.jsx";
import AdminHeaderCLC from "../pages/admin/clcHeader.jsx";

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();

  const showMainHeader = pathname === "/admin/dashboard";
  const showSidebar = pathname === "/admin/dashboard";

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* ✅ Sidebar only on dashboard */}
      {showSidebar && (
        <div className="no-print">
          <AdminSidebar />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {/* ✅ Header switch */}
        <div className="no-print sticky top-0 z-50">
          {showMainHeader ? <AdminHeaderMain /> : <AdminHeaderCLC />}
        </div>

        {/* ✅ Page content */}
        <main className="flex-grow p-4">{children}</main>
      </div>
    </div>
  );
}
