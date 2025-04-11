export const loginRequest = {
  scopes: ["openid", "profile", "email"],
};

export const protectedResources = {
  api: {
    endpoint: process.env.REACT_APP_API_ENDPOINT,
    scopes: [process.env.REACT_APP_API_SCOPE],
  },
};

export const msalConfig = {
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