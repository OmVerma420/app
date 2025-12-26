import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { checkAdminLoggedIn } from "../../store/adminAuthSlice";

export default function AdminProtectedRoute() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { admin, status } = useSelector((s) => s.adminAuth);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!hasChecked.current) {
      dispatch(checkAdminLoggedIn());
      hasChecked.current = true;
    }
  }, [dispatch]);

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

  return <Outlet />;
}
