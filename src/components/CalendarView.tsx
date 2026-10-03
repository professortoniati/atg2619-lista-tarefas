import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus 
} from 'lucide-react';
import type { Task } from '../types';
import { CATEGORY_CONFIGS, DEFAULT_CATEGORY_CONFIG } from '../utils/constants';
import { getTodayString } from '../utils/dateUtils';
import { TaskCard } from './TaskCard';

interface CalendarViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onOpenCreateModalWithDate: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onOpenCreateModalWithDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateString, setSelectedDateString] = useState<string>(getTodayString());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Calculate days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateString(getTodayString());
  };

  // Build calendar matrix
  const days = [];

  // Previous month filler days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNumber = totalDaysInPrevMonth - i;
    const prevM = month === 0 ? 11 : month - 1;
    const prevY = month === 0 ? year - 1 : year;
    const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    days.push({
      dayNumber,
      dateString: dateStr,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      dayNumber: d,
      dateString: dateStr,
      isCurrentMonth: true,
    });
  }

  // Next month filler days to complete grid (42 cells: 6 rows of 7)
  const remainingCells = 42 - days.length;
  for (let d = 1; d <= remainingCells; d++) {
    const nextM = month === 11 ? 0 : month + 1;
    const nextY = month === 11 ? year + 1 : year;
    const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      dayNumber: d,
      dateString: dateStr,
      isCurrentMonth: false,
    });
  }

  // Selected date tasks
  const selectedDayTasks = tasks.filter((t) => t.dueDate === selectedDateString);
  const todayStr = getTodayString();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Calendar Grid Section */}
      <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 capitalize">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400 font-medium">Selecione um dia para gerenciar suas entregas</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              Hoje
            </button>
            <button
              onClick={prevMonth}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Próximo mês"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 uppercase tracking-wider py-1 border-b border-slate-100">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {days.map((item, index) => {
            const dayTasks = tasks.filter((t) => t.dueDate === item.dateString);
            const isSelected = item.dateString === selectedDateString;
            const isToday = item.dateString === todayStr;

            return (
              <button
                key={index}
                onClick={() => setSelectedDateString(item.dateString)}
                className={`min-h-[64px] sm:min-h-[76px] p-1.5 sm:p-2 rounded-2xl flex flex-col justify-between text-left transition-all relative border ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/40 shadow-sm'
                    : isToday
                    ? 'border-blue-300 bg-white'
                    : item.isCurrentMonth
                    ? 'border-slate-100 hover:border-slate-300 bg-white'
                    : 'border-transparent text-slate-300 bg-slate-50/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday
                        ? 'bg-blue-600 text-white'
                        : isSelected
                        ? 'text-blue-700 font-extrabold'
                        : item.isCurrentMonth
                        ? 'text-slate-700'
                        : 'text-slate-300'
                    }`}
                  >
                    {item.dayNumber}
                  </span>

                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Dots / mini indicators */}
                <div className="flex flex-wrap gap-1 mt-1 max-h-5 overflow-hidden">
                  {dayTasks.slice(0, 3).map((task) => {
                    const catCfg = CATEGORY_CONFIGS[task.category] || DEFAULT_CATEGORY_CONFIG;
                    return (
                      <span
                        key={task.id}
                        className={`w-1.5 h-1.5 rounded-full ${catCfg.dotColor} ${
                          task.completed ? 'opacity-40' : ''
                        }`}
                        title={task.title}
                      />
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <span className="text-[9px] text-slate-400 font-bold leading-none">
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Selected Day Agenda Sidebar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Tarefas do Dia</span>
              <h3 className="text-lg font-black text-slate-800">
                {new Date(selectedDateString + 'T00:00:00').toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>
            </div>
            
            <button
              onClick={() => onOpenCreateModalWithDate(selectedDateString)}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition-colors"
              title="Adicionar tarefa neste dia"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Tasks for the day list */}
          <div className="space-y-3 mt-4 max-h-[460px] overflow-y-auto pr-1">
            {selectedDayTasks.length > 0 ? (
              selectedDayTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))
            ) : (
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-700">Nenhuma tarefa agendada</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Aproveite o tempo livre ou adicione uma nova pendência.
                </p>
                <button
                  onClick={() => onOpenCreateModalWithDate(selectedDateString)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Tarefa</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick summary for selected day */}
        {selectedDayTasks.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{selectedDayTasks.filter((t) => t.completed).length} de {selectedDayTasks.length} concluídas</span>
            <span className="font-bold text-blue-600">
              {Math.round((selectedDayTasks.filter((t) => t.completed).length / selectedDayTasks.length) * 100)}%
            </span>
          </div>
        )}

      </div>

    </div>
  );
};
