import React from 'react';
import { 
  Check, 
  Calendar, 
  Trash2, 
  Edit3, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import type { Task } from '../types';
import { CATEGORY_CONFIGS, DEFAULT_CATEGORY_CONFIG, PRIORITY_CONFIGS } from '../utils/constants';
import { formatDate, isTaskOverdue } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const categoryConfig = CATEGORY_CONFIGS[task.category] || DEFAULT_CATEGORY_CONFIG;
  const priorityConfig = PRIORITY_CONFIGS[task.priority] || PRIORITY_CONFIGS.media;
  const isOverdue = isTaskOverdue(task.dueDate, task.completed);
  const formattedDueDate = formatDate(task.dueDate);

  return (
    <div
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-200 bg-white ${
        task.completed
          ? 'opacity-60 bg-slate-50/60 border-slate-200'
          : isOverdue
          ? 'border-rose-200 hover:border-rose-300 hover:shadow-sm shadow-rose-100/30'
          : 'border-slate-200/90 hover:border-blue-200 hover:shadow-md hover:shadow-slate-100'
      }`}
    >
      {/* Left side: Checkbox + Content */}
      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
        
        {/* Custom Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
          className={`relative mt-0.5 sm:mt-0 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
              : 'border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/50'
          }`}
        >
          {task.completed && (
            <Check className="w-4 h-4 stroke-[3]" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0 pr-2">
          
          {/* Title & Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3
              className={`text-sm sm:text-base font-bold text-slate-800 tracking-tight break-words transition-all duration-200 ${
                task.completed
                  ? 'line-through text-slate-600 font-medium'
                  : 'text-slate-800'
              }`}
            >
              {task.title}
            </h3>
          </div>

          {/* Optional description */}
          {task.description && (
            <p
              className={`text-xs sm:text-sm text-slate-500 mb-2 line-clamp-2 ${
                task.completed ? 'line-through text-slate-600' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Tags / Metadata row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            
            {/* Category Tag */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold text-[11px] tracking-wide uppercase border ${categoryConfig.badgeBg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${categoryConfig.dotColor}`} />
              {task.category.toUpperCase()}
            </span>

            {/* Priority Tag */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] tracking-wide uppercase border ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dot}`} />
              {priorityConfig.label}
            </span>

            {/* Due Date Indicator */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-[11px] border ${
                  task.completed
                    ? 'bg-slate-100 text-slate-600 border-slate-200'
                    : isOverdue
                    ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {isOverdue && !task.completed ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span>
                  {isOverdue && !task.completed ? 'Atrasada (' + formattedDueDate + ')' : formattedDueDate}
                </span>
              </span>
            )}

            {/* Completed badge timestamp */}
            {task.completed && task.completedAt && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium ml-1">
                <Clock className="w-3 h-3" />
                Concluída
              </span>
            )}
          </div>

        </div>

      </div>

      {/* Right side: Action buttons */}
      <div className="flex items-center justify-end gap-1 mt-3 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Editar tarefa"
          aria-label="Editar tarefa"
        >
          <Edit3 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Excluir tarefa"
          aria-label="Excluir tarefa"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
