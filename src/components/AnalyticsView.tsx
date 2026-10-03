import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  PieChart, 
  Award,
  ArrowRight
} from 'lucide-react';
import type { Task } from '../types';
import { CATEGORY_CONFIGS, DEFAULT_CATEGORY_CONFIG, PRIORITY_CONFIGS } from '../utils/constants';
import { isTaskOverdue } from '../utils/dateUtils';

interface AnalyticsViewProps {
  tasks: Task[];
  categories: string[];
  onSelectTab: (tab: 'tarefas') => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks,
  categories,
  onSelectTab,
}) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter((t) => isTaskOverdue(t.dueDate, t.completed)).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Category Breakdown
  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat);
    const catCompleted = catTasks.filter((t) => t.completed).length;
    const catRate = catTasks.length > 0 ? Math.round((catCompleted / catTasks.length) * 100) : 0;
    const config = CATEGORY_CONFIGS[cat] || DEFAULT_CATEGORY_CONFIG;

    return {
      name: cat,
      total: catTasks.length,
      completed: catCompleted,
      pending: catTasks.length - catCompleted,
      rate: catRate,
      config,
    };
  }).filter((item) => item.total > 0);

  // Priority Breakdown
  const priorityStats = [
    { key: 'alta', ...PRIORITY_CONFIGS.alta, count: tasks.filter((t) => t.priority === 'alta').length, done: tasks.filter((t) => t.priority === 'alta' && t.completed).length },
    { key: 'media', ...PRIORITY_CONFIGS.media, count: tasks.filter((t) => t.priority === 'media').length, done: tasks.filter((t) => t.priority === 'media' && t.completed).length },
    { key: 'baixa', ...PRIORITY_CONFIGS.baixa, count: tasks.filter((t) => t.priority === 'baixa').length, done: tasks.filter((t) => t.priority === 'baixa' && t.completed).length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide uppercase">
              <Award className="w-3.5 h-3.5" />
              Relatório de Produtividade
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Visão Geral de Desempenho
            </h2>
            <p className="text-blue-100 text-sm max-w-lg">
              Acompanhe seu fluxo de entregas, tarefas pendentes e distribuição de tempo por categoria.
            </p>
          </div>

          {/* Big Circular Progress */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 self-start md:self-auto">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-white"
                  strokeDasharray={`${completionRate}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-white">
                {completionRate}%
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-wide">Taxa de Conclusão</p>
              <p className="text-lg font-black text-white">{completed} de {total} tarefas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendências</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-800">{pending}</p>
          <p className="text-xs text-slate-500 mt-1">Tarefas ativas aguardando ação</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Finalizadas</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600">{completed}</p>
          <p className="text-xs text-slate-500 mt-1">Concluídas com sucesso</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Atenção</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-600">{overdue}</p>
          <p className="text-xs text-slate-500 mt-1">Tarefas com prazo vencido</p>
        </div>

      </div>

      {/* Two Column Section: Category Distribution & Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-base">Progresso por Categoria</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">{categoryStats.length} ativas</span>
          </div>

          <div className="space-y-4 pt-2">
            {categoryStats.length > 0 ? (
              categoryStats.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.config.dotColor}`} />
                      <span className="font-bold text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-600">
                      {item.completed}/{item.total} ({item.rate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${item.config.dotColor}`}
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                Nenhuma tarefa com categoria registrada ainda.
              </p>
            )}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-base">Distribuição por Prioridade</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">3 níveis</span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {priorityStats.map((item) => (
              <div
                key={item.key}
                className={`p-4 rounded-xl border ${item.bg} ${item.border} flex flex-col justify-between`}
              >
                <div>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase ${item.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                    {item.label}
                  </span>
                  <p className={`text-2xl font-black mt-2 ${item.text}`}>{item.count}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium">
                  {item.done} concluídas
                </div>
              </div>
            ))}
          </div>

          {/* Productivity Action / CTA */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3 mt-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Dica de Produtividade</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Comece pelas tarefas de <strong>Alta Prioridade</strong> para ter um dia mais leve.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('tarefas')}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg flex items-center gap-1 text-xs font-bold"
            >
              <span>Ver tarefas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
