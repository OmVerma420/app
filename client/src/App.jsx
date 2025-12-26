import React from "react";
import { Routes, Route } from "react-router-dom";

// ✅ Student
import ProtectedRoute from "./components/protectedRoute";
import InstructionsPage from "./pages/instructionPage.jsx";
import LoginPage from "./pages/loginPage";
import ApplyFormPage from "./pages/applyFormPage";
import PaymentPage from "./pages/paymentPage";
import PrintPage from "./pages/printPage";

// ✅ Admin
import AdminProtectedRoute from "./components/admin/adminProtectedRoute.jsx";
import AdminLogin from "./pages/admin/login.jsx";
import AdminDashboard from "./pages/admin/adminDashboard.jsx";
import CLCRecordPage from "./pages/admin/clcRecordPage.jsx";
import CLCSearchPage from "./pages/admin/clcSearchPage.jsx";
import CLCPrintPage from "./pages/admin/clcPrintPage.jsx";
import CLCPrintPage2 from "./pages/admin/CLCPrintPage2.jsx";
import CLCDashboard from "./pages/admin/CLCDashboard.jsx";   // ✅ Added

// ✅ Admin layout
import AdminLayout from "./layouts/adminLayout.jsx";

export default function App() {
  return (
    <Routes>
      {/* ✅ Public Student Routes */}
      <Route path="/" element={<InstructionsPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* ✅ Student Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/apply" element={<ApplyFormPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/application" element={<PrintPage />} />
      </Route>

      {/* ✅ Admin Public */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ✅ Admin Protected */}
      <Route element={<AdminProtectedRoute />}>

        {/* ✅ Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />

        {/* ✅ CLC Dashboard ✅ */}
        <Route
          path="/admin/clc"
          element={
            <AdminLayout>
              <CLCDashboard />
            </AdminLayout>
          }
        />

        {/* ✅ CLC Sub-pages */}
        <Route
          path="/admin/clc/search"
          element={
            <AdminLayout>
              <CLCSearchPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/clc/records"
          element={
            <AdminLayout>
              <CLCRecordPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/clc/:id"
          element={
            <AdminLayout>
              <CLCPrintPage />
            </AdminLayout>
          }
        />
      </Route>
      <Route
  path="/admin/clc2/:id"
  element={
    <AdminLayout>
      <CLCPrintPage2 />
    </AdminLayout>
  }
/>


      {/* ✅ Not found */}
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}
