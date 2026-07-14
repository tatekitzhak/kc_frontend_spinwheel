import React, { useState, useEffect } from 'react'; 
import axios from 'axios';

import useKeycloak from '../authKeycloakProvider/useKeycloak';

import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import Wheel from '../components/Wheel';
import EntryList from '../components/EntryList';

const INITIAL_ENTRIES = [
    'Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Henry'
];

interface HomePageProps {

}

export default function HomePage({ }: HomePageProps) {
    const [entries, setEntries] = useState<string[]>(INITIAL_ENTRIES);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);

    const { keycloak, authenticated } = useKeycloak();
    const [data, setData] = useState(null);

    const deploy_env = import.meta.env.VITE_DEPLOY_ENV;
    const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;
    
    const fetchData = async () => {
        
        
        if (!keycloak?.token) {
            console.log("HomePage2:", keycloak)
            return
        };

        try {
            let API_URL_PREFIX = 'https';
            let port = '';

            if(deploy_env == 'development'){
                API_URL_PREFIX = 'http';
                port = ':'+3000;
            }
            const BACKEND_API_KC_PROTECTED_ENDPOINT = `https://${BACKEND_API_URL}/keycloak/protected`;

            console.log("HomePage keycloak:", keycloak)
            console.log("HomePage BACKEND_API_KC_PROTECTED_ENDPOINT:", BACKEND_API_KC_PROTECTED_ENDPOINT)

            // 1. Ensure token is fresh
            await keycloak.updateToken(30);

            // 2. Make the Axios request
            const response = await axios.get( BACKEND_API_KC_PROTECTED_ENDPOINT, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json',
                },
            });

            setData(response.data);
            console.log('Server Response:', response.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const handleSpin = () => {
        if (entries.length < 2 || isSpinning) return;
        setWinner(null);
        setIsSpinning(true);
    };

    const handleWinner = (name: string) => {
        setWinner(name);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
        });
    };

    const removeWinner = () => {
        setEntries(entries.filter(e => e !== winner));
        setWinner(null);
    };

    return (
        <>
            <div className="min-h-screen bg-[#FDFCFB] text-gray-900 font-sans selection:bg-black selection:text-white">
                <div>
                    <h1>Welcome to the Home Page!!</h1>
                    <h1>&#9432; How it works</h1>
                    {authenticated ? (
                        <div>
                            <p>Hello, {keycloak?.tokenParsed?.preferred_username}!</p>

                            <button onClick={fetchData} className=" py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors  items-center justify-center gap-2">
                                Fetch Protected Data
                            </button>

                            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
                        </div>
                    ) : (
                        <p>Please log in to access your personalized content.</p>
                    )}


                    <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                            {/* Wheel Section */}
                            <div className="lg:col-span-7 flex flex-col items-center gap-8">

                                <div className="relative w-full">
                                    <Wheel
                                        entries={entries}
                                        onWinner={handleWinner}
                                        isSpinning={isSpinning}
                                        setIsSpinning={setIsSpinning}
                                    />
                                </div>

                                <button
                                    onClick={handleSpin}
                                    disabled={isSpinning || entries.length < 2}
                                    className={`group relative px-12 py-5 rounded-full text-2xl font-black uppercase tracking-widest transition-all
                                                    ${isSpinning || entries.length < 2
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-black text-white hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_70px_rgba(0,0,0,0.3)]'
                                                    } 
                                                `}
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        {isSpinning ? 'Spinning...' : 'Spin Now'}
                                    </span>
                                </button>

                                {entries.length < 2 && !isSpinning && (
                                    <p className="text-sm text-red-500 font-medium animate-pulse">
                                        Add at least 2 entries to spin!
                                    </p>
                                )}
                            </div>

                            {/* Sidebar Section */}
                            <div className="lg:col-span-5 h-[600px] sticky top-28">
                                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 h-full flex flex-col">
                                    <EntryList
                                        entries={entries}
                                        setEntries={setEntries}
                                        isSpinning={isSpinning}
                                    />
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Footer Info */}
                    <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-100 mt-12">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 opacity-50">
                            <div className="flex items-center gap-2 text-sm">
                                <Info size={16} />
                                <span>SpinDraw — The ultimate random picker</span>
                            </div>
                            <p className="text-sm">© 2026 SpinDraw Interactive</p>
                        </div>
                    </footer>

                    {/* Winner Modal */}
                    <AnimatePresence>
                        {winner && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                    onClick={() => setWinner(null)}
                                />
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                                    className="relative bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl overflow-hidden"
                                >
                                    {/* Decorative background element */}
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400" />

                                    <div className="mb-6 inline-flex p-4 bg-yellow-100 rounded-full text-yellow-600">
                                        <Trophy size={48} />
                                    </div>

                                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                                        We have a winner!
                                    </h2>

                                    <div className="text-5xl font-black mb-8 break-words leading-tight">
                                        {winner}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => setWinner(null)}
                                            className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={removeWinner}
                                            className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <X size={18} />
                                            Remove from list
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </>
    );
}
