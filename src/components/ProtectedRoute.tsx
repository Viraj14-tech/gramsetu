import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePortal } from '../utils/PortalContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRole: UserRole;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole, children }) => {
  const { currentUser } = usePortal();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser.role !== allowedRole) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};
