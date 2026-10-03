import React from 'react';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ListFilter 
} from 'lucide-react';
import type { FilterStatus, SortOption, Category } from '../types';
import { CATEGORY_CONFIGS, DEFAULT_CATEGORY_CONFIG } from '../utils/constants';

interface FilterBarProps {
  filterStatus: FilterStatus;
  onFilterStatusChange: (status: FilterStatus) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Category[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onOpenCreateModal: () => void;
  counts: {
    total: number;
    pending: number;
    completed: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterStatus,
  onFilterStatusChange,
  selectedCategory,
  onCategoryChange,
  categories,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  onOpenCreateModal,
  counts,
}) => {
  return (
    <div className="space-y-4">
      {/* Top row: Search input + Create Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg transition-all duration-150 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nova Tarefa</span>
        </button>

      </div>

      {/* Middle row: Status Tabs & Sort selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        
        {/* Status Filter Buttons (Todas, Pendentes, Concluídas) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 overflow-x-auto max-w-full">
          <button
            onClick={() => onFilterStatusChange('todas')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              filterStatus === 'todas'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>Todas</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                filterStatus === 'todas'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {counts.total}
            </span>
          </button>

          <button
            onClick={() => onFilterStatusChange('pendentes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              filterStatus === 'pendentes'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pendentes</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                filterStatus === 'pendentes'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => onFilterStatusChange('concluidas')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              filterStatus === 'concluidas'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Concluídas</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                filterStatus === 'concluidas'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {counts.completed}
            </span>
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1 hidden sm:flex">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            Ordenar por:
          </label>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200/90 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm cursor-pointer"
          >
            <option value="dueDate">Data de Vencimento</option>
            <option value="priority">Prioridade (Alta → Baixa)</option>
            <option value="createdAt">Mais Recentes</option>
            <option value="title">Ordem Alfabética</option>
          </select>
        </div>

      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1 pr-1 flex-shrink-0">
          <ListFilter className="w-3.5 h-3.5 text-slate-600" />
          Categorias:
        </span>
        
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedCategory === 'all'
              ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todas
        </button>

        {categories.map((cat) => {
          const cfg = CATEGORY_CONFIGS[cat] || DEFAULT_CATEGORY_CONFIG;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? `${cfg.badgeBg} ring-2 ring-blue-500/20 shadow-sm`
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`} />
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
