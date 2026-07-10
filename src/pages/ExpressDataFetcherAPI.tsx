import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ExpressAPIProps {

}

export default function ExpressDataFetcherAPI({ }: ExpressAPIProps) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deploy_env = import.meta.env.VITE_DEPLOY_ENV;
  console.log("HomePage deploy_env:", deploy_env)

  useEffect(() => {
    // 2. Create an AbortController to cancel the request if the component unmounts
    const abortController = new AbortController();

    let API_URL_PREFIX = 'https';
    let port: number ;
    let fixedport = ':'+port;

    if (deploy_env == 'development') {
      API_URL_PREFIX = 'http';
      port = 3000;
      fixedport = ':'+port;
    }


    console.log("HomePage API_URL_PREFIX:", API_URL_PREFIX)

    const fetchData = async () => {
      

      try {
        setLoading(true);
        const response = await axios.get(`${API_URL_PREFIX}://localhost${fixedport}/favourites`, {
          headers: {

            'Content-Type': 'application/json',
          },
        });

        console.log('ExpressDataFetcherAPI:',response);

        setError(null);
      } catch (err) {
        // Only update error state if it wasn't a manual abort cancellation
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    // 3. Invoke the function
    fetchData();

    // 4. Return cleanup function to abort the fetch if component unmounts
    return () => {
      abortController.abort();
    };
  }, []); // Empty array ensures this effect runs exactly once on mount

  // 5. Conditional rendering based on states
  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error:: {error}</p>;

  return (
    <>
      <div className="min-h-screen bg-[#FDFCFB] text-gray-900 font-sans selection:bg-black selection:text-white">
        <div>
          <h1>Welcome to the ExpressJS API Page!!</h1>

          <ul>
            {data.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>

        </div>

      </div>
    </>
  );
}


