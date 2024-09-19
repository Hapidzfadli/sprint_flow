import React from 'react';
import { Button } from "../../components/ui/button"
import { updateTask, deleteTask, Task } from '../../services/api';
import { MoreHorizontal, MessageSquare, Paperclip } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

interface TaskListProps {
  title: string;
  tasks: Task[];
  onTasksChange: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ title, tasks, onTasksChange }) => {
  const handleComplete = async (id: number, isCompleted: boolean) => {
    try {
      await updateTask(id, { is_completed: !isCompleted });
      onTasksChange();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      onTasksChange();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title} ({tasks.length})</h2>
        <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={()=>{}}>
          + Add new task
        </Button>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-400">{task.description}</p>
              </div>     
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild >
                  <Button variant="ghost" className="text-gray-400 p-0 hover:text-white">
                    <div className='bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-lg  dark:bg-gray-700 dark:text-gray-400 border border-gray-500'><MoreHorizontal size={20} /></div>
                  </Button>
                  </TooltipTrigger>
                  <TooltipContent side='right' className='bg-slate-600 grid grid-cols-1 divide-y p-0 font-medium cursor-pointer '>
                    <Button
                      className="hover:bg-slate-800 rounded-none h-8 px-2 flex gap-2 text-left justify-start  items-center"
                      title="View"
                      onClick={()=>{}}
                    >
                      
                      <FontAwesomeIcon className="h-4 w-4 text-blue-200" icon={faEye} />
                      View
                    </Button>
                    <Button
                      className="hover:bg-slate-800 rounded-none h-8 px-2 flex gap-2 text-center justify-start  items-center"
                      title="Edit"
                      onClick={()=>{}}
                    >
                      <FontAwesomeIcon
                        className="h-4 w-4 text-yellow-200 "
                        icon={faPenToSquare}
                      />
                      Edit
                    </Button>
                    <Button
                      className="hover:bg-slate-800 rounded-none h-8 px-2 flex gap-2 text-center justify-start items-center "
                      title="Delete"
                      onClick={()=>{}}
                    >
                      <FontAwesomeIcon
                        className="h-4 w-4 text-red-200 "
                        icon={faTrashCan}
                      />
                      Delete
                    </Button>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                
            <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-lg me-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500 ">
            <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z"/>
            </svg>
                {new Date(task.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            
              <div className="flex items-center space-x-2">
                <span ><span className='font-bold text-xl'>1</span><span className='text-sm'>/2</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;