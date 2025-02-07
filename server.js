import express from "express";
import cors from "cors";
import "dotenv/config";
import "./database.js"; // Ensure your database is set up properly
import { Todo } from "./model/index.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "https://todo-backend-hd.surge.sh", // Frontend domain
    "http://localhost:5173",           // Local development
  ],
  methods: ["GET", "POST", "PATCH", "DELETE"], // Allowed methods
  credentials: true, // Allow cookies if needed
}));

// Routes
app.get("/api/v1/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ _id: -1 });
    res.status(200).json({ data: todos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching todos" });
  }
});

app.post("/api/v1/todo", async (req, res) => {
  const obj = {
    todoContent: request.body.todo,
    ip: request.ip,
  };

  const result = await Todo.create(obj)

  response.send({ message: "todo add hogya hy", data: result });
});

app.patch("/api/v1/todo/:id", async (req, res) => {
  try {
    const { todoContent } = req.body;
    if (!todoContent) {
      return res.status(400).json({ message: "Content is required" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { todoContent },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ data: updatedTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating todo" });
  }
});

app.delete("/api/v1/todo/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting todo" });
  }
});

// Fallback route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Export for Vercel
export default app;
