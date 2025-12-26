import React from "react";
import CLCHeader from "@/pages/admin/clcHeader.jsx";

export default function CLCLayout({ children }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <CLCHeader />

      {/* CONTENT */}
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
