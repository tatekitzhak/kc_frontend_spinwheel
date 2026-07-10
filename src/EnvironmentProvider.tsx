import React, { createContext, useContext } from 'react';

// Define the Context:
const EnvironmentContext = createContext(null);


interface EnvironmentProps {
    children: React.ReactNode;
}

// 2. Create the Provider:

export default function EnvironmentProvider({children }: EnvironmentProps) {
   
  // Accessing variables from .env files
  const config = {
    GQL_URI: import.meta.env.VITE_GQL_URI as string,
    apiURL: process.env.REACT_APP_API_URL,
    theme: process.env.REACT_APP_THEME,
    APP_NAME: import.meta.env.VITE_APP_NAME as string, 
  }

  return (
    <EnvironmentContext.Provider value={config}>
      {children}
    </EnvironmentContext.Provider>
  );
}

// 3. Consume the Context In a component:
export const useEnvironment = () => useContext(EnvironmentContext);

const Component = () => {
  const { apiURL } = useEnvironment();
  return <div>API is: {apiURL}</div>;
};

// 4. Wrap Application:

{/* 
    <EnvironmentProvider>
    <App />
    </EnvironmentProvider> 
*/}
