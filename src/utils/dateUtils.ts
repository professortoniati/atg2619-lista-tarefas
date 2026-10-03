export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;

  const taskDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const taskTime = taskDate.getTime();

  if (taskTime === today.getTime()) {
    return 'Hoje';
  }
  if (taskTime === tomorrow.getTime()) {
    return 'Amanhã';
  }
  if (taskTime === yesterday.getTime()) {
    return 'Ontem';
  }

  return taskDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

export function isTaskOverdue(dueDate?: string, completed?: boolean): boolean {
  if (!dueDate || completed) return false;
  
  const [year, month, day] = dueDate.split('-').map(Number);
  if (!year || !month || !day) return false;

  const taskDate = new Date(year, month - 1, day, 23, 59, 59);
  const now = new Date();

  return taskDate.getTime() < now.getTime();
}

export function isTaskDueToday(dueDate?: string): boolean {
  if (!dueDate) return false;
  const [year, month, day] = dueDate.split('-').map(Number);
  const taskDate = new Date(year, month - 1, day);
  const today = new Date();
  return (
    taskDate.getFullYear() === today.getFullYear() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getDate() === today.getDate()
  );
}

export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTomorrowString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getNextWeekString(): string {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const year = nextWeek.getFullYear();
  const month = String(nextWeek.getMonth() + 1).padStart(2, '0');
  const day = String(nextWeek.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
