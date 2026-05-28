/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SubmitPrompt } from './components/SubmitPrompt';
import { ViewPrompts } from './components/ViewPrompts';
import { Terminal, PlusCircle, LayoutList, Home as HomeIcon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'view' | 'submit'>('home');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      
      {/* Header */}
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-5xl py-4 flex flex-col md:flex-row items-center gap-4 relative">
          
          <div className="flex w-full md:w-1/4 justify-center md:justify-start">
            <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Terminal className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="font-bold text-xl tracking-tight">
                Jailbreak<span className="text-neutral-500 font-medium">Hub</span>
              </h1>
            </button>
          </div>

          <nav className="flex w-full md:w-2/4 justify-center items-center gap-2 bg-neutral-900/50 p-1.5 rounded-2xl border border-neutral-800 overflow-x-auto no-scrollbar shadow-sm">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === 'home'
                  ? 'bg-neutral-800 text-white shadow'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <HomeIcon className="w-5 h-5 md:w-4 md:h-4" />
              <span className="text-sm">Beranda</span>
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === 'view'
                  ? 'bg-neutral-800 text-white shadow'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <LayoutList className="w-5 h-5 md:w-4 md:h-4" />
              <span className="text-sm">Perpustakaan</span>
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === 'submit'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <PlusCircle className="w-5 h-5 md:w-4 md:h-4" />
              <span className="text-sm">Bagi Prompt</span>
            </button>
          </nav>

          <div className="hidden md:block w-1/4"></div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 max-w-5xl py-8 md:py-12">
        {activeTab === 'home' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-3xl mb-4">
              <Terminal className="w-16 h-16 text-indigo-400" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
              Selamat datang di <br/>Jailbreak<span className="text-indigo-400">Hub</span>
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl px-4">
              Platform komunitas untuk mencari, melihat, dan berbagi prompt jailbreak terbaik untuk AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-xl px-4 mt-8">
              <button 
                onClick={() => setActiveTab('view')} 
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-4 px-6 rounded-2xl border border-neutral-700 hover:border-neutral-600 transition-all flex items-center justify-center gap-2"
              >
                <LayoutList className="w-5 h-5" />
                Perpustakaan Jailbreak
              </button>
              <button 
                onClick={() => setActiveTab('submit')} 
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-[0_0_30px_rgba(79,70,229,0.2)] flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Bagi Prompt Jailbreak Kalian
              </button>
            </div>
          </div>
        )}
        {activeTab === 'view' && <ViewPrompts />}
        {activeTab === 'submit' && <SubmitPrompt />}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-8 mt-auto text-center">
        <p className="text-neutral-500 text-sm flex items-center justify-center gap-2">
          <Terminal className="w-4 h-4" />
          Komunitas Prompt Jailbreak.
        </p>
      </footer>
    </div>
  );
}
