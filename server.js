import express from "express";
import cors from "cors";
import "dotenv/config";
import "./database.js"; // Ensure your database is set up properly
import { Todo } from "./model/index.js";

const app = express();
const port = process.env.PORT || 5173;

app.use(express.json());
app.use(cors({ 
  origin: ["http://localhost:5173", "https://your-frontend.surge.sh"] 
}));

app.get("/api/v1/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ _id: -1 });
    res.status(200).json({ data: todos });
  } catch (err) {
    res.status(500).json({ message: "Error fetching todos" });
  }
});

app.post("/api/v1/todo", async (req, res) => {
  try {
    const { todoContent } = req.body;
    if (!todoContent) return res.status(400).send({ message: "Content is required" });

    const newTodo = await Todo.create({ todoContent });
    res.status(201).json({ data: newTodo });
  } catch (err) {
    res.status(500).json({ message: "Error adding todo" });
  }
});

app.patch("/api/v1/todo/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });

    res.status(200).json({ data: updatedTodo });
  } catch (err) {
    res.status(500).json({ message: "Error updating todo" });
  }
});

app.delete("/api/v1/todo/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ message: "Todo not found" });

    res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting todo" });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
