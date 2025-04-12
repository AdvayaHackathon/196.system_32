import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check if user has the required role
  if (role && currentUser.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute; 