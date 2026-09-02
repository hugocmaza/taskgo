export interface Task {
  id?: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'alta' | 'media' | 'baja';
  done: boolean;
}
