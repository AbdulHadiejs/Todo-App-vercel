import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const base_Url = "https://todo-app-vercel-mauve.vercel.app"; // Backend URL (Express server)

  const getTodo = async () => {
    try {
      const res = await axios(`${base_Url}/api/v1/todos`);
      const serverTodos = res?.data?.data;
      const editTodo = serverTodos.map((todo) => {
        return { ...todo, isEditing: false };
      });
      setTodos(editTodo);
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Error fetching todos");
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
      await axios.post(`${base_Url}/api/v1/todo`, { todoContent: newTodo });
      getTodo(); // Reload the todos list
      setNewTodo(""); // Clear the input
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Error adding todo");
    }
  };

  const editTodo = async (event, todoId) => {
    event.preventDefault();
    const todoValue = event.target.children[0].value;

    if (!todoValue.trim()) {
      toast.error("Please enter valid content for the todo.");
      return;
    }

    try {
      await axios.patch(`${base_Url}/api/v1/todo/${todoId}`, {
        todoContent: todoValue,
      });
      getTodo(); // Reload the todos list
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Error updating todo");
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`${base_Url}/api/v1/todo/${todoId}`);
      toast.success("Todo deleted successfully");
      getTodo(); // Reload the todos list
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting todo");
    }
  };

  const toggleEditing = (index) => {
    const newTodos = todos.map((todo, i) => {
      if (i === index) {
        todo.isEditing = !todo.isEditing;
      } else {
        todo.isEditing = false;
      }
      return todo;
    });
    setTodos(newTodos);
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center">
        <div className="bg-white p-8 w-96 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 animate__animated animate__fadeIn">
            To-Do List
          </h1>

          <form onSubmit={addTodo} className="mb-4">
            <input
              type="text"
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
          </form>

          <div className="space-y-4">
            {todos?.map((todo, index) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-indigo-100"
              >
                <div className="flex items-center">
                  {!todo.isEditing ? (
                    <span className="ml-3 text-lg text-gray-700">
                      {todo.todoContent}
                    </span>
                  ) : (
                    <form onSubmit={(e) => editTodo(e, todo.id)} className="flex gap-8">
                      <input
                        type="text"
                        defaultValue={todo.todoContent}
                        className="w-full p-4 border-2 border-gray-300 rounded-xl"
                      />
                      <div className="flex flex-row">
                        <button
                          type="button"
                          onClick={() => toggleEditing(index)}
                          className="text-red-500 hover:text-red-700 text-lg transition-all duration-300"
                        >
                          ⛔
                        </button>
                        <button
                          type="submit"
                          className="text-red-500 hover:text-red-700 text-lg transition-all duration-300"
                        >
                          ✔️
                        </button>
                      </div>
                    </form>
                  )}
                </div>
                <div>
                  {!todo.isEditing ? (
                    <button
                      onClick={() => toggleEditing(index)}
                      className="text-red-500 hover:text-red-700 text-lg transition-all duration-300"
                    >
                      🖍
                    </button>
                  ) : null}

                  {!todo.isEditing ? (
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700 text-lg transition-all duration-300"
                    >
                      🗑️
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <footer className="mt-8 flex items-center justify-between">
            <span className="text-gray-600">{todos.length} tasks left</span>
            <button className="text-indigo-600 hover:text-indigo-800 font-semibold transition-all duration-300">
              Clear All
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
