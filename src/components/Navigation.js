import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Hospital Management
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/doctor-dashboard"
                className={`${isActive('/doctor-dashboard')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Doctor Dashboard
              </Link>
              <Link
                to="/patient-dashboard"
                className={`${isActive('/patient-dashboard')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Patient Dashboard
              </Link>
              <Link
                to="/appointments"
                className={`${isActive('/appointments')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Appointments
              </Link>
              <Link
                to="/patients"
                className={`${isActive('/patients')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Patients
              </Link>
              <Link
                to="/medical-records"
                className={`${isActive('/medical-records')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Medical Records
              </Link>
              <Link
                to="/prescriptions"
                className={`${isActive('/prescriptions')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Prescriptions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 