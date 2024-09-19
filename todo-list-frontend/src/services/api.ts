import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  is_completed: boolean;
  progress: number;
}

export interface Subtask {
  id: number;
  task_id: number;
  title: string;
  is_completed: boolean;
}

export const getTasks = () => axios.get<Task[]>(`${API_URL}/tasks`);
export const createTask = (task: Omit<Task, 'id' | 'progress'>) => axios.post<Task>(`${API_URL}/tasks`, task);
export const updateTask = (id: number, task: Partial<Task>) => axios.put<Task>(`${API_URL}/tasks/${id}`, task);
export const deleteTask = (id: number) => axios.delete(`${API_URL}/tasks/${id}`);

export const getSubtasks = (taskId: number) => axios.get<Subtask[]>(`${API_URL}/tasks/${taskId}/subtasks`);
export const createSubtask = (taskId: number, subtask: Omit<Subtask, 'id'>) => axios.post<Subtask>(`${API_URL}/tasks/${taskId}/subtasks`, subtask);
export const updateSubtask = (id: number, subtask: Partial<Subtask>) => axios.put<Subtask>(`${API_URL}/subtasks/${id}`, subtask);
export const deleteSubtask = (id: number) => axios.delete(`${API_URL}/subtasks/${id}`);