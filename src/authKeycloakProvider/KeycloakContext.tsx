import React, { createContext, useRef, useEffect, useState, useMemo } from 'react';
import Keycloak, { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';

interface KeycloakContextState {
  keycloak: Keycloak | null;
  authenticated: boolean;
  isInitialized: boolean;
}

const KeycloakContext = createContext<KeycloakContextState | undefined>(undefined);

interface KeycloakProviderProps {
  children?: React.ReactNode;
}

const KeycloakProvider = ({ children }: KeycloakProviderProps) => {
  const isInitialized = useRef(false);

  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const KC_API_URL = import.meta.env.VITE_KC_ADMIN_CONSOLE_API_URL;
    const KC_PORT = import.meta.env.VITE_KC_ADMIN_CONSOLE_PORT;
    const KEYCLOACK_CLIENT_ID = import.meta.env.VITE_KC_ADMIN_CONSOLE_CLIENT_ID;

    const KEYCLOAK_API_ENDPOINT = `https://${KC_API_URL}:${KC_PORT}/`;

    console.log("KEYCLOACK_CLIENT_ID:", KEYCLOACK_CLIENT_ID)
    console.log("KEYCLOAK_API_ENDPOINT:", KEYCLOAK_API_ENDPOINT)
    console.log("KeycloakProvider1:", isInitialized)
    // Prevent double-init in React Strict Mode
    if (isInitialized.current) {
      console.log("KeycloakProvider2:", isInitialized)
      return;
    }
    isInitialized.current = true;

   

    const KeycloakParams: KeycloakConfig = {
      url: KEYCLOAK_API_ENDPOINT,
      realm: `${import.meta.env.VITE_KC_ADMIN_CONSOLE_REAL_NAME}`,
      clientId: KEYCLOACK_CLIENT_ID,
      // url: 'https://3.135.226.230:8443/',
      // realm: 'ec2realm1',
      // clientId: 'ec2_public_client_webapp_id',
    };

    const initOptions: KeycloakInitOptions = {
      // onLoad: 'check-sso', // Tries to see if a session exists in the background. If it fails to find the server, it can still cause a hang or a redirect loop if not handled correctly.
      // onLoad: 'login-required',  //Forces a redirect to the Keycloak login page immediately if the user isn't authenticated.
      onLoad: undefined, // Don't force a check on page load or use 'check-sso' but wrap it in a try/catch
      pkceMethod: 'S256',
      checkLoginIframe: false,
    };

    const keycloakInstance = new Keycloak(KeycloakParams);

    const initKeycloak = async () => {
      try {
        const auth = await keycloakInstance.init(initOptions);
        setKeycloak(keycloakInstance);
        setAuthenticated(auth);
      } catch (error) {
        console.error('Keycloak initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initKeycloak();
  }, []);

  // Memoize the value to optimize performance
  const contextValue = useMemo(() => ({
    keycloak,
    authenticated,
    isInitialized: !loading
  }), [keycloak, authenticated, loading]);

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated }}>
      {children}
    </KeycloakContext.Provider>
  );
};

export { KeycloakProvider, KeycloakContext }
