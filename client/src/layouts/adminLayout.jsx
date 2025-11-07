import React from "react";
import AdminHeader from "../pages/admin/adminHeader.jsx";
import AdminSidebar from "../pages/admin/adminSidebar.jsx";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <div className="no-print">
        <AdminSidebar />
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="no-print sticky top-0 z-50">
          <AdminHeader />
        </div>

        {/* CONTENT */}
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
