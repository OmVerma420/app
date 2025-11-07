import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// ✅ Student Auth
import { checkLoggedIn } from "./store/authSlice";
import ProtectedRoute from "./components/protectedRoute";

// ✅ Admin Auth
import { checkAdminLoggedIn } from "./store/adminAuthSlice";
import AdminProtectedRoute from "./components/admin/adminProtectedRoute.jsx";

// ✅ Student pages
import InstructionsPage from "./pages/instructionPage.jsx";
import LoginPage from "./pages/loginPage";
import ApplyFormPage from "./pages/applyFormPage";
import PaymentPage from "./pages/paymentPage";
import PrintPage from "./pages/printPage";

// ✅ Admin pages
import AdminLogin from "./pages/admin/login.jsx";
import AdminDashboard from "./pages/admin/adminDashboard.jsx";
import CLCListPage from "./pages/admin/clcListPage.jsx";
import CLCSearchPage from "./pages/admin/clcSearchPage.jsx";
import CLCViewPage from "./pages/admin/clcViewPage.jsx";
import CLCPrintPage from "./pages/admin/clcPrintPage.jsx";   // ✅ ADDED

export default function App() {
  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.auth);

  // ✅ Run both student + admin check
  useEffect(() => {
    dispatch(checkLoggedIn());
    dispatch(checkAdminLoggedIn());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* ✅ Public routes (Student) */}
      <Route path="/" element={<InstructionsPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* ✅ Student protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/apply" element={<ApplyFormPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/application" element={<PrintPage />} />
      </Route>

      {/* ✅ Admin Public Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ✅ Admin Protected Routes */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* ✅ CLC admin flow */}
        <Route path="/admin/clc" element={<CLCListPage />} />
        <Route path="/admin/clc/search" element={<CLCSearchPage />} />
        <Route path="/admin/clc/:id" element={<CLCViewPage />} />
        <Route path="/admin/clc/:id/print" element={<CLCPrintPage />} /> {/* ✅ ADDED */}
      </Route>

      {/* ✅ Fallback */}
      <Route path="*" element={<div className="p-8">404 Not Found</div>} />
    </Routes>
  );
}
