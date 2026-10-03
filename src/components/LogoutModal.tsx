import React from 'react';
import { LogOut, RefreshCw, X } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateLogout: () => void;
  onResetData: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onSimulateLogout,
  onResetData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-md p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Encerrar Sessão</h3>
              <p className="text-xs text-slate-500">Selecione como deseja prosseguir</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={onSimulateLogout}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-all"
          >
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">Sair da Conta</p>
              <p className="text-[11px] text-slate-500">Suas tarefas permanecem salvas localmente neste navegador.</p>
            </div>
            <LogOut className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={onResetData}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-left transition-all"
          >
            <div>
              <p className="text-xs sm:text-sm font-bold text-rose-800 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
                Restaurar Dados Iniciais
              </p>
              <p className="text-[11px] text-rose-600/80">Recarrega as tarefas padrão de demonstração.</p>
            </div>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
