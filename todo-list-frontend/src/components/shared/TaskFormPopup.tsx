import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Task, Subtask, createTask, updateTask } from '../../services/api';
import { PlusCircle, Trash2 } from 'lucide-react';

interface TaskFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  onSave: (task: Task) => void;
  mode: 'add' | 'edit' | 'view';
}

const TaskFormPopup: React.FC<TaskFormPopupProps> = ({ isOpen, onClose, task, onSave, mode }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDeadline(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '');
      setSubtasks(task.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setDeadline('');
      setSubtasks([]);
    }
  }, [task]);

  const handleSave = async () => {
    const taskData = {
      title,
      description,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      subtasks: subtasks,
    };

    let savedTask: Task;
    if (mode === 'add') {
      savedTask = (await createTask(taskData)).data;
    } else {
      savedTask = (await updateTask(task!.id, taskData)).data;
    }

    onSave(savedTask);
    onClose();
  };

  const addSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([...subtasks, { title: newSubtaskTitle, is_completed: false }]);
      setNewSubtaskTitle('');
    }
  };

  const toggleSubtask = (index: number) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].is_completed = !newSubtasks[index].is_completed;
    setSubtasks(newSubtasks);
  };

  const deleteSubtaskHandler = (index: number) => {
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] w-full bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {mode === 'add' ? 'Add New Task' : mode === 'edit' ? 'Edit Task' : 'Task Details'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-300">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                disabled={mode === 'view'}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                disabled={mode === 'view'}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline" className="text-sm font-medium text-gray-300">
                Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                disabled={mode === 'view'}
              />
            </div>
          </div>
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-300">Subtasks</Label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox
                    checked={subtask.is_completed}
                    onCheckedChange={() => toggleSubtask(index)}
                    disabled={mode === 'view'}
                    className="border-gray-500"
                  />
                  <Input
                    value={subtask.title}
                    onChange={(e) => {
                      const newSubtasks = [...subtasks];
                      newSubtasks[index].title = e.target.value;
                      setSubtasks(newSubtasks);
                    }}
                    disabled={mode === 'view'}
                    className="flex-grow bg-gray-700 border-gray-600 text-white"
                  />
                  {mode !== 'view' && (
                    <Button onClick={() => deleteSubtaskHandler(index)} variant="destructive" size="icon">
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {mode !== 'view' && (
              <div className="flex gap-2">
                <Input
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="New subtask"
                  className="flex-grow bg-gray-700 border-gray-600 text-white"
                />
                <Button onClick={addSubtask} variant="secondary">
                  <PlusCircle size={18} className="mr-2" />
                  Add
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          {mode !== 'view' && (
            <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormPopup;