import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    todoContent: {
      type: String,
      required: [true, "todoContent is required"],
    },
    ip: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
