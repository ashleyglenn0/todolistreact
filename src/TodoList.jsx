import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodoList.css";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch tasks from the backend
  useEffect(() => {
    axios
      .get("http://18.118.48.128:8080/api/tasks")
      .then((response) => {
        setTasks(response.data || []); // Fallback to an empty array if response.data is null
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    const newTask = { name: editName, description: editDescription, completed: false };
    axios
      .post("http://18.118.48.128:8080/api/tasks", newTask)
      .then((response) => {
        setTasks([...tasks, response.data]);
        setEditName("");
        setEditDescription("");
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    axios
      .delete(`http://18.118.48.128:8080/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((error) => console.error("Error deleting task:", error));
  };

  // Mark a task as completed
  const handleMarkAsCompleted = (id) => {
    const updatedTask = tasks.find((task) => task.id === id);
    updatedTask.completed = true;
    axios
      .put(`http://18.118.48.128:8080/api/tasks/${id}/complete`, updatedTask)
      .then(() => {
        setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
      })
      .catch((error) => console.error("Error marking task as completed:", error));
  };

  // Start editing a task
  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditName(task.name);
    setEditDescription(task.description);
  };

  // Save the edited task
  const handleSaveTask = (id) => {
    const updatedTask = { name: editName, description: editDescription };
    axios
      .put(`http://18.118.48.128:8080/api/tasks/${id}`, updatedTask)
      .then((response) => {
        setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
        setEditingTaskId(null); // Exit edit mode
      })
      .catch((error) => console.error("Error saving task:", error));
  };

  return (
    <div className="container">
      <h1>Welcome to the To-Do List!!!</h1>
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Task Name"
          required
        />
        <input
          type="text"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Task Description"
          required
        />
        <button type="submit">Add Task</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id}>
                {editingTaskId === task.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSaveTask(task.id)}>Save</button>
                      <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{task.name}</td>
                    <td>{task.description}</td>
                    <td>
                      {task.completed ? (
                        <span>Completed</span>
                      ) : (
                        <>
                          <button
                            className="btn-complete"
                            onClick={() => handleMarkAsCompleted(task.id)}
                          >
                            Mark as Completed
                          </button>
                          <button
                            className="btn-edit"
                            onClick={() => handleEditTask(task)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No tasks available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
