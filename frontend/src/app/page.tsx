"use client";
import { useEffect, useState } from "react";

type Task = { id: number; title: string; completed: boolean };

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState<string>("");
  const [filter, setFilter] = useState<"All" | "Active" | "Completed">("All");

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:4000/tasks");
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      setMessage("❌ โหลดงานไม่สำเร็จ");
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      const res = await fetch("http://localhost:4000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Save failed:", res.status, text);
        setMessage(`❌ บันทึกงานไม่สำเร็จ (${res.status})`);
        return;
      }
      setMessage("🚀 บันทึกงานสำเร็จแล้ว ไปต่อเลย!");
      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Add task error:", error);
      setMessage("❌ บันทึกงานไม่สำเร็จ (network)");
    }
  };

  const toggleTask = async (task: Task) => {
    await fetch(`http://localhost:4000/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`http://localhost:4000/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Filter logic
  const filteredTasks = tasks.filter((task) => {
    if (filter === "Active") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.length - completedCount;
  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center p-6">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
          🚀 Task Manager
        </h1>

        {/* ✅ feedback message */}
        {message && (
          <div className="mb-6 text-center text-sm font-medium p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 shadow-md animate-pulse">
            {message}
          </div>
        )}

        {/* Input zone */}
        <div className="flex gap-3 mb-8">
          <input
            className="flex-1 p-3 rounded-xl border border-gray-600 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="✍️ Add a new task..."
          />
          <button
            onClick={addTask}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg transform hover:scale-105 transition font-semibold"
          >
            Add
          </button>
        </div>

        {/* ✅ Filter + Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {["All", "Active", "Completed"].map((f) => (
              <button
                key={f}
                onClick={() =>
                  setFilter(f as "All" | "Active" | "Completed")
                }
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                  filter === f
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-400">
            {activeCount} left / {completedCount} done
          </div>
        </div>

        {/* ✅ Task list / Empty state */}
        {filteredTasks.length === 0 ? (
          <div className="text-center text-gray-400 py-10 animate-pulse">
            <p className="text-2xl">✨ No tasks yet ✨</p>
            <p className="text-sm">
              Add your first task and get productive!
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-4 bg-gray-800/70 rounded-xl shadow hover:shadow-xl transition"
              >
                <label className="flex items-center gap-3 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                    className="w-5 h-5 accent-cyan-400 cursor-pointer"
                  />
                  <span
                    className={`text-lg ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-white"
                    }`}
                  >
                    {task.title}
                  </span>
                </label>

                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <button
                      onClick={() => toggleTask(task)}
                      className="px-3 py-1 rounded-lg border border-gray-500 text-sm hover:bg-gray-700 transition"
                    >
                      Undo
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleTask(task)}
                      className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-400 text-sm text-black font-semibold transition"
                    >
                      Mark done
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-400 text-sm font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* 📊 Visualization */}
        <div className="mt-10 p-6 bg-gray-900/60 rounded-xl shadow-inner">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">📊 Progress Overview</h2>
          <div className="w-full h-40 flex items-center justify-center">
            <div
              className="relative w-32 h-32 rounded-full bg-gray-700"
              style={{
                background: `conic-gradient(
                  #06b6d4 ${(completedCount / (tasks.length || 1)) * 360}deg,
                  #374151 0
                )`,
              }}
            >
              <span className="absolute inset-0 flex items-center justify-center font-bold text-white">
                {progress}%
              </span>
            </div>
          </div>
        </div>

        {/* 🤖 AI Summary */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg">
          <h2 className="text-lg font-semibold mb-2">🤖 Summary</h2>
          <p className="text-sm">
            Based on your tasks, focus on{" "}
            <strong>
              {tasks.find((t) => !t.completed)?.title || "your pending task"}
            </strong>{" "}
            first. You're {progress}% done. Keep it up! 🚀
          </p>
        </div>
      </div>
    </main>
  );
}
