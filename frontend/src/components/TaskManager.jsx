import React, { useEffect, useState } from 'react';
import AddTaskDialog from './TaskForm';
import TaskList from './TaskList';
import { getTasks } from '../api/taskService'; // Make sure this exists

const TaskManager = () => {
    const [editingTask, setEditingTask] = useState(null);
    const [reload, setReload] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [allTasks, setAllTasks] = useState([]);

    const handleReload = () => {
        setReload(!reload);
        setEditingTask(null);
    };

    useEffect(() => {
        fetchAllTasks();
    }, [reload]);

    const fetchAllTasks = async () => {
        try {
            const res = await getTasks();
            setAllTasks(res.data);
        } catch (e) {
            console.error('Error fetching tasks for stats', e);
        }
    };

    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.isCompleted).length;
    const overdue = allTasks.filter((t) => {
        const deadline = new Date(t.deadline);
        return !t.isCompleted && deadline < new Date();
    }).length;

    return (
        <>
            <div className="header">
                <div className="header-left">
                    <h2>Task Manager</h2>
                    <div className="search">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="search-bar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <button onClick={() => setDialogOpen(true)}>Add Task</button>
                </div>
            </div>

            <div className="stats-container">
                <div className="stat-card total">
                    <h3>Total Tasks</h3>
                    <p className="stat-number">{total}</p>
                </div>
                <div className="stat-card completed">
                    <h3>Completed</h3>
                    <p className="stat-number">{completed}</p>
                </div>
                <div className="stat-card overdue">
                    <h3>Overdue</h3>
                    <p className="stat-number">{overdue}</p>
                </div>
            </div>
            <TaskList
                key={reload}
                onEdit={(task) => {
                    setEditingTask(task);
                    setDialogOpen(true);
                }}
                searchTerm={searchTerm}
                onReload={handleReload}
            />

            <AddTaskDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setEditingTask(null);
                }}
                onSuccess={handleReload}
                editingTask={editingTask} 
            />

        </>
    );
};

export default TaskManager;
