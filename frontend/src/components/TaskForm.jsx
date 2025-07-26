import React, { useEffect, useState } from 'react';
import { createTask, updateTask } from '../api/taskService';

const AddTaskDialog = ({ open, onClose, onSuccess, editingTask }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    category: 'Personal',
    priority: 'LOW',
    deadline: '',
  });

  const [errors, setErrors] = useState({});

  // Set default values or load editing task
  useEffect(() => {
    if (open) {
      if (editingTask) {
        setTask({ ...editingTask });
      } else {
        const now = new Date();
        const iso = now.toISOString().slice(0, 16);
        setTask({
          title: '',
          description: '',
          category: 'Personal',
          priority: 'LOW',
          deadline: iso,
        });
      }
      setErrors({});
    }
  }, [open, editingTask]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!task.title.trim()) newErrors.title = 'Title is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (editingTask) {
        await updateTask(task);
      } else {
        await createTask(task);
      }
      onSuccess();
      onClose();
    } catch (e) {
      console.error('Error submitting task:', e);
      alert('Failed to save task.');
    }
  };

  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2>{editingTask ? 'Edit Task' : 'Add Task'}</h2>

        <input
          name="title"
          placeholder="Title *"
          value={task.title}
          onChange={handleChange}
          style={{ borderColor: errors.title ? 'red' : '' }}
        />
        {errors.title && <p style={{ color: 'red' }}>{errors.title}</p>}

        <input
          name="description"
          placeholder="Description"
          value={task.description}
          onChange={handleChange}
        />

        <select name="category" value={task.category} onChange={handleChange}>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Others">Others</option>
        </select>

        <select name="priority" value={task.priority} onChange={handleChange}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <input
          name="deadline"
          type="datetime-local"
          value={task.deadline?.slice(0, 16)}
          onChange={handleChange}
        />

        <div className="dialog-buttons">
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="confirm" onClick={handleSubmit}>
            {editingTask ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskDialog;
