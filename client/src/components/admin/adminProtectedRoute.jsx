import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { checkAdminLoggedIn } from "../../store/adminAuthSlice";

export default function AdminProtectedRoute() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { admin, status } = useSelector((s) => s.adminAuth);

  // Ensure session
  useEffect(() => {
    if (!admin) dispatch(checkAdminLoggedIn());
  }, [dispatch, admin]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
