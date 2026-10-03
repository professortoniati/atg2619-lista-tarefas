import React, { useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  TrendingUp, 
  PlusCircle, 
  Sparkles, 
  AlertTriangle 
} from 'lucide-react';
import type { Task, FilterStatus, SortOption, Category } from '../types';
import { TaskCard } from './TaskCard';
import { FilterBar } from './FilterBar';
import { isTaskOverdue, isTaskDueToday } from '../utils/dateUtils';

interface TasksViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onOpenCreateModal: () => void;
  filterStatus: FilterStatus;
  onFilterStatusChange: (status: FilterStatus) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Category[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onOpenCreateModal,
  filterStatus,
  onFilterStatusChange,
  selectedCategory,
  onCategoryChange,
  categories,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
}) => {
  // Counts & stats
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const overdueCount = tasks.filter((t) => isTaskOverdue(t.dueDate, t.completed)).length;
  const dueTodayCount = tasks.filter((t) => !t.completed && isTaskDueToday(t.dueDate)).length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered and Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (filterStatus === 'pendentes' && task.completed) return false;
        if (filterStatus === 'concluidas' && !task.completed) return false;

        // Category filter
        if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(query);
          const matchDesc = task.description?.toLowerCase().includes(query);
          const matchCat = task.category.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Active tasks before completed if viewing 'todas'
        if (filterStatus === 'todas') {
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
        }

        if (sortOption === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }

        if (sortOption === 'priority') {
          const priorityWeight: Record<string, number> = { alta: 3, media: 2, baixa: 1 };
          return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        }

        if (sortOption === 'createdAt') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        if (sortOption === 'title') {
          return a.title.localeCompare(b.title, 'pt-BR');
        }

        return 0;
      });
  }, [tasks, filterStatus, selectedCategory, searchQuery, sortOption]);

  return (
    <div className="space-y-6">
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Total de Tarefas</p>
            <p className="text-2xl font-black text-slate-800">{totalCount}</p>
          </div>
        </div>

        {/* Pendentes Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Pendentes</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800">{pendingCount}</span>
              {dueTodayCount > 0 && (
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                  {dueTodayCount} hoje
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Concluídas Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Concluídas</p>
            <p className="text-2xl font-black text-emerald-600">{completedCount}</p>
          </div>
        </div>

        {/* Progresso Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Progresso</p>
              <span className="text-xs font-black text-indigo-600">{completionRate}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Overdue Alert Banner if any */}
      {overdueCount > 0 && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 text-rose-800">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-medium">
              Você tem <strong>{overdueCount} {overdueCount === 1 ? 'tarefa atrasada' : 'tarefas atrasadas'}</strong> que precisa de atenção.
            </p>
          </div>
          <button
            onClick={() => onFilterStatusChange('pendentes')}
            className="text-xs font-bold text-rose-700 underline hover:text-rose-900 whitespace-nowrap"
          >
            Ver pendentes
          </button>
        </div>
      )}

      {/* Main Filter & Search Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">
        <FilterBar
          filterStatus={filterStatus}
          onFilterStatusChange={onFilterStatusChange}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          sortOption={sortOption}
          onSortChange={onSortChange}
          onOpenCreateModal={onOpenCreateModal}
          counts={{
            total: totalCount,
            pending: pendingCount,
            completed: completedCount,
          }}
        />
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
              Nenhuma tarefa encontrada
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
              {searchQuery || selectedCategory !== 'all' || filterStatus !== 'todas'
                ? 'Nenhum resultado corresponde aos filtros selecionados. Tente ajustar os filtros ou limpar a busca.'
                : 'Você está em dia com todas as suas pendências! Crie uma nova tarefa para organizar o seu dia.'}
            </p>
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Adicionar Primeira Tarefa</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
