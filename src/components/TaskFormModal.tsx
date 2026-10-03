import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Tag, 
  Flag, 
  AlignLeft, 
  CheckSquare, 
  Plus 
} from 'lucide-react';
import type { Task, Priority, Category } from '../types';
import { getTodayString, getTomorrowString, getNextWeekString } from '../utils/dateUtils';
import { PRIORITY_CONFIGS } from '../utils/constants';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    description?: string;
    category: Category;
    priority: Priority;
    dueDate?: string;
  }) => void;
  taskToEdit?: Task | null;
  categories: Category[];
  onAddCategory: (category: string) => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  categories,
  onAddCategory,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Trabalho');
  const [priority, setPriority] = useState<Priority>('media');
  const [dueDate, setDueDate] = useState<string>(getTodayString());
  const [newCatInput, setNewCatInput] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Trabalho');
      setPriority('media');
      setDueDate(getTodayString());
    }
    setError('');
    setShowAddCat(false);
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título da tarefa.');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      dueDate: dueDate || undefined,
    });

    onClose();
  };

  const handleAddNewCategory = () => {
    if (newCatInput.trim()) {
      onAddCategory(newCatInput.trim());
      setCategory(newCatInput.trim());
      setNewCatInput('');
      setShowAddCat(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden transition-all transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              {taskToEdit ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Título da Tarefa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ex: Finalizar apresentação da sprint..."
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                error
                  ? 'border-rose-300 focus:ring-rose-200 text-rose-900'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 text-slate-900'
              }`}
            />
            {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
          </div>

          {/* Description input */}
          <div>
            <label className="flex items-center gap-1 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              Descrição / Detalhes (Opcional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione observações, links ou critérios de aceitação..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 transition-all resize-none"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category Select */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="flex items-center gap-1 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Categoria
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddCat(!showAddCat)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  Nova
                </button>
              </div>

              {showAddCat ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    placeholder="Nome da categoria"
                    className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    className="px-2.5 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 transition-all cursor-pointer font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Priority Selection */}
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                Prioridade
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['baixa', 'media', 'alta'] as Priority[]).map((p) => {
                  const cfg = PRIORITY_CONFIGS[p];
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 border ${
                        isSelected
                          ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-2 ring-blue-500/20 shadow-sm`
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Due Date & Quick presets */}
          <div>
            <label className="flex items-center gap-1 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              Data de Conclusão
            </label>
            
            <div className="space-y-2">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 font-medium transition-all"
              />

              {/* Quick Date Presets */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium">Atalhos:</span>
                <button
                  type="button"
                  onClick={() => setDueDate(getTodayString())}
                  className="px-2 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => setDueDate(getTomorrowString())}
                  className="px-2 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Amanhã
                </button>
                <button
                  type="button"
                  onClick={() => setDueDate(getNextWeekString())}
                  className="px-2 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Próxima Semana
                </button>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
            >
              {taskToEdit ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
