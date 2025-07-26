import axios from 'axios';

const API = 'http://localhost:8080/tasks';

export const getTasks = () => axios.get(API);
export const createTask = (task) => axios.post(API, task);
export const updateTask = (task) => axios.put(`${API}/${task.id}`, task);
export const deleteTask = (id) => axios.delete(`${API}/${id}`);
