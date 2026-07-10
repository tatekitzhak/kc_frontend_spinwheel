import React, { useState } from 'react';
import { Trophy, X, RotateCw, Settings2, Share2, Info, LogIn } from 'lucide-react';
import LoginButton from '../LoginButton';

import useKeycloak from '../../authKeycloakProvider/useKeycloak';

interface WelcomePgeProps {
  
}

export default function NavBar({  }: WelcomePgeProps) {
  const { keycloak, authenticated } = useKeycloak();
  const [data, setData] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center rotate-3">
              <RotateCw className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">SpinDraw</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <LoginButton />
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Settings2 size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
    </header>
  );
}
