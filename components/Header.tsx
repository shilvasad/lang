import React from 'react';
import { InstallIcon } from './Icons';

interface HeaderProps {
    isInstallable: boolean;
    onInstallClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isInstallable, onInstallClick }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 md:px-6 md:py-5 flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Suyena Logo" className="h-14 w-auto" />
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                  <span className="text-blue-600">Bengali-Italian</span> Phrasebook
                </h1>
                <p className="text-slate-500 mt-1">Your personal guide to learning Italian.</p>
            </div>
        </div>
        {isInstallable && (
            <button
                onClick={onInstallClick}
                className="flex items-center space-x-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Install the application"
            >
                <InstallIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Install App</span>
            </button>
        )}
      </div>
    </header>
  );
};

export default Header;