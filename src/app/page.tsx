"use client"

import { useEffect, useState } from "react";
import AddTodo from "./components/addTodo";
import TodoList from "./components/todoList";
import { Task } from "./type";
import { getTasks } from "./db";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]|null>(null)
  const [pageSize, setPageSize] = useState(5)
  const [page, setPage] = useState(0)

  useEffect(() => {
      async function fetchTasks() {
          const fetchedTasks = await getTasks(pageSize, page)
          setTasks(fetchedTasks)
      }
      fetchTasks()
      
  }, [page, pageSize])

  const setTaskCallBack = (tasks: Task[] | null) => {
    setTasks(tasks)
  }

  return (
    <main className="flex min-h-screen flex-col items-center pt-24 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-5">To Do</h1>
      <div className="flex flex-col list-container">
        <AddTodo setTaskCallBack={setTaskCallBack} pageSize={pageSize} page={page} />
        <TodoList tasks={tasks} />
      </div>
    </main>
  );
}
