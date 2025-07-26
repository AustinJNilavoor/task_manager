import { useState } from 'react'
import './App.css'
import TaskManager from './components/TaskManager';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  const [editingTask, setEditingTask] = useState(null);
  const [reload, setReload] = useState(false);

  const handleReload = () => {
    setReload(!reload);
    setEditingTask(null);
  };

  return (
    <div className="App">
      <TaskManager />
    </div>
  );
}

export default App;
