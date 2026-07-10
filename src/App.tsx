import { BrowserRouter, Routes, Route } from 'react-router';
import { KeycloakProvider } from './authKeycloakProvider/KeycloakContext';
import ExpressDataFetcherAPI from './pages/ExpressDataFetcherAPI'
import Layout from './components/Layout/Layout';
import ErrorBoundary from './authKeycloakProvider/ErrorBoundary';


const HealthCheckPge = () => {
  return (
    <>
      status: 200
      <br />
      environment: 
    </>

    
  )
}

function App() {
  return (
    <>
    {/* <ErrorBoundary> */}
      <KeycloakProvider>
        <BrowserRouter>

          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                </Layout>
              }
            />
            <Route path="/react_health" element={ <HealthCheckPge /> } />
            <Route path="/express_api" element={ <ExpressDataFetcherAPI /> } />

          </Routes>

        </BrowserRouter>
      </KeycloakProvider>
    {/* </ErrorBoundary> */}
    </>
  )
}

export default App
