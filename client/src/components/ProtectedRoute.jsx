import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Layout from './Layout';

export default function ProtectedRoute() {
  const location = useLocation();
  const { student, status } = useSelector((s) => s.auth);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!student) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout />;
}
