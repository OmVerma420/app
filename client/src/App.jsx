import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkLoggedIn } from "./store/authSlice";
import ProtectedRoute from "./components/protectedRoute";
import InstructionsPage from "./pages/instructionPage.jsx";
import LoginPage from "./pages/loginPage";
import ApplyFormPage from "./pages/applyFormPage";
import PaymentPage from "./pages/paymentPage";
import PrintPage from "./pages/printPage";

export default function App() {
  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(checkLoggedIn());
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
      <Route path="/" element={<InstructionsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/apply" element={<ApplyFormPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/application" element={<PrintPage />} />
      </Route>
      <Route path="*" element={<div className="p-8">404 Not Found</div>} />
    </Routes>
  );
}
