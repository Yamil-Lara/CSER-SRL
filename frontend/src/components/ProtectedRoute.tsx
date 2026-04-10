import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}
export function ProtectedRoute({
  children,
  requireAdmin = false
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    return children;
  }
  if (requireAdmin && !isAdmin) {
    return children;
  }
  return <>{children}</>;
}