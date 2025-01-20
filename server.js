import express from "express";
import cors from "cors";
import 'dotenv/config';
import './database.js';
import { Todo } from "./model/index.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local Frontend
      "https://frontend.surge.sh", // Deployed Frontend
      "https://marvelous-capybara-0bee09.netlify.app", // Deployed Frontend
    ],
  })
);

// Get all todos
app.get("/api/v1/todos", async (req, res) => {
  try {
    const todos = await Todo.find({}, { __v: 0, updatedAt: 0 }) // Exclude metadata
      .sort({ _id: -1 }) // Sort by newest first
      .lean(); // Return plain objects instead of Mongoose documents

    const formattedTodos = todos.map(todo => ({
      id: todo._id, // Map `_id` to `id`
      todoContent: todo.todoContent,
    }));

    res.status(200).send({
      data: formattedTodos,
      message: formattedTodos.length ? "Todos fetched successfully" : "No todos found",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Add a new todo
app.post("/api/v1/todo", async (req, res) => {
  const { todoContent } = req.body;

  if (!todoContent) {
    return res.status(400).send({ message: "todoContent is required" });
  }

  try {
    const newTodo = await Todo.create({ todoContent, ip: req.ip });

    res.status(201).send({
      message: "Todo added successfully",
      data: {
        id: newTodo._id, // Return `id` instead of `_id`
        todoContent: newTodo.todoContent,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error adding todo" });
  }
});

// Update an existing todo
app.patch("/api/v1/todo/:id", async (req, res) => {
  const { id } = req.params;
  const { todoContent } = req.body;

  if (!todoContent) {
    return res.status(400).send({ message: "todoContent is required" });
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { todoContent },
      { new: true, lean: true } // Return the updated document
    );

    if (!updatedTodo) {
      return res.status(404).send({ message: "Todo not found" });
    }

    res.status(200).send({
      message: "Todo updated successfully",
      data: {
        id: updatedTodo._id, // Return `id` instead of `_id`
        todoContent: updatedTodo.todoContent,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating todo" });
  }
});

// Delete a todo
app.delete("/api/v1/todo/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).send({ message: "Todo not found" });
    }

    res.status(200).send({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting todo" });
  }
});

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).send({ message: "No route found" });
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
