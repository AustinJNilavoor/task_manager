import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask, updateTask } from '../api/taskService';

export default function TaskList({ onEdit, searchTerm, onReload }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      const sorted = res.data.sort((a, b) =>
        a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1
      );
      setTasks(sorted);
    } catch (e) {
      console.error('Failed to fetch tasks:', e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      await loadTasks();
      onReload();
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Error deleting task: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask({ ...task, isCompleted: !task.isCompleted });
      await loadTasks();
      onReload();
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Error updating task');
    }
  };

const filteredTasks = tasks.filter((t) => {
  const term = searchTerm.toLowerCase();
  return (
    t.title?.toLowerCase().includes(term) ||
    t.description?.toLowerCase().includes(term) ||
    t.category?.toLowerCase().includes(term)
  );
});


  return (
    <div>
      {filteredTasks.map((t) => (
        <div
  key={t.id}
  className={`task-item ${t.isCompleted ? 'completed' : ''}`}
 
>
<div className="task-main">
            <div className="task-left">
              <input
                type="checkbox"
                checked={t.isCompleted}
                onChange={() => handleToggleComplete(t)}
              />
              <div className="task-mid"  onClick={() => onEdit(t)} >
                <div className="task-top">
                  <span className="task-title"><p>{t.title}</p></span>
                </div>
                <div className="task-bottom">
                  <p className="task-desc">{t.description}</p>
                  <div className="task-info">
                    <span className={`task-category-box ${t.category.toLowerCase()}`}>
                      {t.category}
                    </span>
                    <span className="task-priority">{t.priority}</span>
                    <span className="task-deadline">
                      <i className="fas fa-calendar-alt" style={{ marginRight: '4px' }}></i>
                      {t.deadline?.slice(0, 10)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button className="delete" onClick={() => handleDelete(t.id)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      ))}

      {filteredTasks.length === 0 && <p>No tasks found.</p>}
    </div>
  );
}
