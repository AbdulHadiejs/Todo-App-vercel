import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const getUrl = () => {
  const isHosted = window.location.href.includes("https");
  return isHosted
    ? "https://smit-backend-batch-11.vercel.app"
    : "http://localhost:5173";
};

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const getTodo = async () => {
    try {
      const res = await axios.get(`${getUrl()}/api/v1/todos`);
      const serverTodos = res.data.data || [];
      const editTodo = serverTodos.map((todo) => ({
        ...todo,
        isEditing: false,
      }));
      setTodos(editTodo);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching todos");
    }
  };

  useEffect(() => {
    getTodo();
  }, []);

  const addTodo = async (event) => {
    event.preventDefault();
    if (!newTodo.trim()) {
      toast.error("Please enter a todo.");
      return;
    }

    try {
      await axios.post(`${getUrl()}/api/v1/todo`, { todoContent: newTodo });
      getTodo();
      setNewTodo("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding todo");
    }
  };

  const editTodo = async (event, todoId) => {
    event.preventDefault();
    const todoContent = event.target.children[0].value;

    if (!todoContent.trim()) {
      toast.error("Please enter valid content for the todo.");
      return;
    }

    try {
      await axios.patch(`${getUrl()}/api/v1/todo/${todoId}`, { todoContent });
      getTodo();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating todo");
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`${getUrl()}/api/v1/todo/${todoId}`);
      toast.success("Todo deleted successfully");
      getTodo();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting todo");
    }
  };

  const clearTodos = async () => {
    try {
      const ids = todos.map((todo) => todo._id);
      await Promise.all(ids.map((id) => axios.delete(`${getUrl()}/api/v1/todo/${id}`)));
      toast.success("All todos cleared successfully");
      getTodo();
    } catch (error) {
      toast.error("Error clearing todos");
    }
  };

  const toggleEditing = (index) => {
    const newTodos = todos.map((todo, i) => ({
      ...todo,
      isEditing: i === index ? !todo.isEditing : false,
    }));
    setTodos(newTodos);
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center">
        <div className="bg-white p-8 w-96 rounded-2xl shadow-2xl">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            To-Do List
          </h1>

          <form onSubmit={addTodo} className="mb-4">
            <input
              type="text"
              className="w-full p-4 border-2 border-gray-300 rounded-xl"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
          </form>

          <div className="space-y-4">
            {todos.map((todo, index) => (
              <div
                key={todo._id}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-xl shadow-md"
              >
                <div>
                  {!todo.isEditing ? (
                    <span className="text-lg text-gray-700">
                      {todo.todoContent}
                    </span>
                  ) : (
                    <form onSubmit={(e) => editTodo(e, todo._id)}>
                      <input
                        type="text"
                        defaultValue={todo.todoContent}
                        className="w-full p-4 border-2 rounded-xl"
                      />
                    </form>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => toggleEditing(index)}
                    className="text-indigo-500"
                  >
                    {todo.isEditing ? "✔️" : "🖍"}
                  </button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="text-red-500"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <footer className="mt-4 flex justify-between">
            <span>{todos.length} tasks left</span>
            <button onClick={clearTodos} className="text-indigo-500">
              Clear All
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
