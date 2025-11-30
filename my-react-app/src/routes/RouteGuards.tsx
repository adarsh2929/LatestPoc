import React from 'react';
import { Navigate } from 'react-router-dom';

import useUser from '../zustand/useUser';

export const PrivateRoute = ({
  children,
  permission,
}: {
  children: React.ReactNode;
  permission?: string | string[];
}) => {
  const {
    user: { token, permissions = [], is_admin: isAdmin },
  } = useUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  if (permission) {
    const required = Array.isArray(permission) ? permission : [permission];
    const hasAnyPermission = required.some((perm) =>
      permissions.includes(perm)
    );

    if (!hasAnyPermission) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const {
    user: { token },
  } = useUser();

  return token ? <Navigate to="/" replace /> : <>{children}</>;
};
