import React from 'react';
import { LogOut, RefreshCw, X, ShieldAlert } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
  onResetData: () => void;
  userName?: string;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
  onResetData,
  userName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-md p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Encerrar Sessão</h3>
              <p className="text-xs text-slate-500">Conectado como <strong className="text-slate-700">{userName || 'Usuário'}</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={onConfirmLogout}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 text-left transition-all cursor-pointer group"
          >
            <div>
              <p className="text-sm font-bold text-rose-700 flex items-center gap-1.5">
                <LogOut className="w-4 h-4 text-rose-600" />
                Sair da Conta (Logout)
              </p>
              <p className="text-xs text-rose-600/80 mt-0.5">Encerra a sessão atual e retorna para a tela de autenticação.</p>
            </div>
          </button>

          <button
            onClick={onResetData}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-all cursor-pointer"
          >
            <div>
              <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                Restaurar Tarefas de Exemplo
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Recarrega as tarefas padrão de demonstração para o seu perfil.</p>
            </div>
          </button>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-2 text-xs text-slate-500">
          <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>Suas tarefas estão sincronizadas com segurança no Supabase.</span>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
