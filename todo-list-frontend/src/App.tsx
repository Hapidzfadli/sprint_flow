import React, { useState, useEffect } from 'react';
import TaskList from './components/shared/TaskList';
import { getTasks, Task } from './services/api';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const todoTasks = tasks.filter(task => !task.is_completed);
  const inProgressTasks = tasks.filter(task => !task.is_completed && task.progress > 0 && task.progress < 100);
  const completedTasks = tasks.filter(task => task.is_completed);

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <h1 className='text-3xl font-bold'> Hello Hapid </h1>
      <div className="grid grid-cols-3 gap-4">
        <TaskList title="To Do" tasks={todoTasks} onTasksChange={fetchTasks} />
        <TaskList title="In Progress" tasks={inProgressTasks} onTasksChange={fetchTasks} />
        <TaskList title="Completed" tasks={completedTasks} onTasksChange={fetchTasks} />
      </div>
    </div>
  );
}

export default App;