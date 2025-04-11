import React, { createContext, useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
    authority: `https://${process.env.REACT_APP_AZURE_TENANT_NAME}.b2clogin.com/${process.env.REACT_APP_AZURE_TENANT_NAME}.onmicrosoft.com/${process.env.REACT_APP_AZURE_POLICY_NAME}`,
    knownAuthorities: [`${process.env.REACT_APP_AZURE_TENANT_NAME}.b2clogin.com`],
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const account = msalInstance.getAllAccounts()[0];
    if (account) {
      setCurrentUser(account);
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    loading,
    msalInstance
  };

  return (
    <MsalProvider instance={msalInstance}>
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    </MsalProvider>
  );
} 