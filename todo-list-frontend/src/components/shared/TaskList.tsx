import React, { useState } from 'react';
import { Button } from "../../components/ui/button"
import { updateTask, deleteTask, Task } from '../../services/api';
import { MoreHorizontal, MessageSquare, Paperclip } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import TaskFormPopup from './TaskFormPopup';
import { toast, Toaster } from 'react-hot-toast';

interface TaskListProps {
  title: string;
  tasks: Task[];
  onTasksChange: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ title, tasks, onTasksChange }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('add');

  const handleAddTask = () => {
    setSelectedTask(undefined);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setFormMode('view');
    setIsFormOpen(true);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      onTasksChange();
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleSaveTask = async (updatedTask: Task) => {
    try {
      if (formMode === 'add') {
        toast.success('Task added successfully');
      } else {
        toast.success('Task updated successfully');
      }
      onTasksChange();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
    }
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title} ({tasks.length})</h2>
        {title === 'To Do' && (
          <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={handleAddTask}>
            + Add new task
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-400">{task.description}</p>
              </div>     
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="text-gray-400 p-0 hover:text-white">
                    <div className='bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-lg dark:bg-gray-700 dark:text-gray-400 border border-gray-500'>
                      <MoreHorizontal size={20} />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent side='right' className='bg-slate-600 grid grid-cols-1 divide-y p-0 font-medium cursor-pointer w-32'>
                  <Button
                    className="hover:bg-slate-800 rounded-none h-8 px-2 flex gap-2 text-left justify-start items-center"
                    title="View"
                    onClick={() => handleViewTask(task)}
                  >
                    <FontAwesomeIcon className="h-4 w-4 text-blue-200" icon={faEye} />
                    View
                  </Button>
                  <Button
                    className="hover:bg-slate-800 rounded-none h-8 px-2 flex gap-2 text-center justify-start items-center"
                    title="Edit"
                    onClick={() => handleEditTask(task)}
                  >
                    <FontAwesomeIcon className="h-4 w-4 text-yellow-200" icon={faPenToSquare} />
                    Edit
                  </Button>
                  <Button
                    className="hover:bg-slate-800 rounded-none h-8 px-2 flex gap-2 text-center justify-start items-center"
                    title="Delete"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <FontAwesomeIcon className="h-4 w-4 text-red-200" icon={faTrashCan} />
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
            <div className="mt-4">
              <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-orange-500 h-full rounded-full" 
                  style={{width: `${task.progress}%`}}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
              <span className={`bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-lg me-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500 ${task.deadline && isDeadlinePassed(task.deadline) ? 'bg-red-500 dark:bg-red-700' : ''}`}>
                <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z"/>
                </svg>
                {task.deadline
                  ? new Date(task.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'No deadline'}
              </span>
              <div className="flex items-center space-x-2">
                <span><span className='font-bold text-xl'>{task.subtasks?.filter(st => st.is_completed).length || 0}</span><span className='text-sm'>/{task.subtasks?.length || 0}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <TaskFormPopup
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        task={selectedTask}
        onSave={handleSaveTask}
        mode={formMode}
      />
    </div>
  );
};

export default TaskList;