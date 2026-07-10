import React, { useState, ReactNode } from 'react';
import HomePage from '../../pages/HomePage'

import NavBar from './NavBar';


interface LayoutProps {
    
}

export default function Layout({  }: LayoutProps) {
 
  return (
    <>
        <NavBar />
        <div className="min-h-screen bg-[#FDFCFB] text-gray-900 font-sans selection:bg-black selection:text-white">
            <HomePage />
        </div>
    </>
  );
}
