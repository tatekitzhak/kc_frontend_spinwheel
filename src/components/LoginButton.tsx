import React from 'react';
import { Link } from 'react-router'
import useKeycloak from '../authKeycloakProvider/useKeycloak';

interface LoginButtonProps {
}

export default function LoginButton({ }: LoginButtonProps) {
  const { keycloak, authenticated } = useKeycloak();

  const handleLogin = () => {
    try {
      console.log("handleLogin keycloak user:", keycloak)
      console.log("NavBar authenticated:", authenticated)
      const login = keycloak?.login();

    } catch (error) {
      console.error('Keycloak login failed:', error);

    } finally {

    }

  };

  const handleLogout = () => {
    console.log("handleLogout keycloak user:", keycloak)
    keycloak?.logout();
  };

  return (
    <div className="flex flex-col h-full gap-6">

      {authenticated ? (
        <>
          <button color="inherit" component={Link} to="/my-account">
            My Account
          </button>
          <button color="inherit" component={Link} to="/my-items">
            My Items
          </button>
          <button color="inherit" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <button onClick={handleLogin} className=" py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors  items-center justify-center gap-2">

            <span>Login</span>
          </button>
          <div>
            <Link to="/health" style={{ color: 'inherit', textDecoration: 'none' }}>
              Keycloak POC
            </Link>
          </div>
        </>
      )}


    </div>
  );
}
