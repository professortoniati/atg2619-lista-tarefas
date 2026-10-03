import React from 'react';
import { 
  CheckSquare, 
  BarChart3, 
  CalendarDays, 
  LogOut,
  Database,
  RefreshCw
} from 'lucide-react';
import type { NavigationTab } from '../types';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenLogout: () => void;
  pendingCount: number;
  isSyncing?: boolean;
  onSync?: () => void;
  isOnline?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenLogout,
  pendingCount,
  isSyncing = false,
  onSync,
  isOnline = true,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Cloud Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <CheckSquare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">TaskPulse</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-600 rounded-md border border-blue-200">PRO</span>
                
                {/* Supabase Connected Badge */}
                <div 
                  className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border transition-all ${
                    isOnline 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                  title={isOnline ? 'Conectado ao Supabase (lista-tarefas)' : 'Modo Offline / LocalStorage'}
                >
                  <Database className="w-2.5 h-2.5" />
                  <span className="font-semibold">{isOnline ? 'Supabase: lista-tarefas' : 'Offline'}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                </div>
              </div>
              <p className="text-[11px] text-slate-600 font-medium hidden sm:block">Gestão Ágil & Produtividade na Nuvem</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shadow-inner">
            <button
              onClick={() => onSelectTab('tarefas')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                currentTab === 'tarefas'
                  ? 'bg-white text-blue-600 shadow-sm shadow-slate-200/50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Tarefas</span>
              {pendingCount > 0 && (
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full transition-colors ${
                    currentTab === 'tarefas'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('analises')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                currentTab === 'analises'
                  ? 'bg-white text-blue-600 shadow-sm shadow-slate-200/50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Análises</span>
            </button>

            <button
              onClick={() => onSelectTab('calendario')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                currentTab === 'calendario'
                  ? 'bg-white text-blue-600 shadow-sm shadow-slate-200/50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Calendário</span>
            </button>
          </nav>

          {/* Right Action: Sync, User & Logout */}
          <div className="flex items-center gap-2">
            {onSync && (
              <button
                onClick={onSync}
                disabled={isSyncing}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 hover:border-blue-200 transition-all"
                title="Sincronizar com Supabase"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            )}

            <div className="hidden md:flex items-center gap-2 pr-2 border-r border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700">
                LT
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">Leandro Toniati</p>
                <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  Online
                </p>
              </div>
            </div>

            <button
              onClick={onOpenLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-all"
              title="Sair do aplicativo"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

