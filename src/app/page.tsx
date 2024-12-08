"use client"

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

import AddTodo from "./components/addTodo";
import TodoList from "./components/todoList";
import { Task } from "./type";
import { getTasks, getTasksCount } from "./db";
import PageSize from "./components/pageSize";
import Calender from "./components/calender";
import FilterComplete from "./components/filterComplete";
import SortDate from "./components/sortDate";
import PageList from "./components/pageList";
import ExportExcel from "./components/exportExcel";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]|null>(null)
  const [pageSize, setPageSize] = useState<number>(5)
  const [page, setPage] = useState<number>(0)
  const [totalTask, setTotalTask] = useState<number>(0)
  const [filter, setFilter] = useState<string>("")
  const [sort, setSort] = useState<string|null>(null)
  const [filterComplete, setFilterComplete] = useState<boolean|null>(null)

  const isTaskProcessRunning = useRef(false);

  useEffect(() => {

      isTaskProcessRunning.current = true;
      async function fetchTasks() {
          const fetchedTasks = await getTasks(pageSize, page, filter, sort, filterComplete )
          setTasks(fetchedTasks)
      }
      async function fetchTaskCounts() {
          const taskCount= await getTasksCount(pageSize, page, filter, filterComplete )
          setTotalTask(taskCount)
      }
      fetchTasks()
      fetchTaskCounts()
  }, [tasks, page, pageSize, filter, sort, filterComplete])


  const setTaskCallBack = (tasks: Task[] | null) => {
    setTasks(tasks)
  }

  const setPageCallBack = (page: number) => {
    setPage(page)
  }

  const setPageSizeCallBack = (pageSize: number) => {
    setPageSize(pageSize)
  }

  const setfilterCompleteCallBack = (filterComplete: boolean|null) => {
    setFilterComplete(filterComplete)
  }

  const setSortDateCallBack = (sortDate: string|null) => {
    setSort(sortDate)
  }

  return (
    <main className="flex min-h-screen flex-col items-center pt-24 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-5">To Do</h1>
      <div className="flex flex-col list-container w-full">

        <div className="flex flex-row justify-between mb-5">
          <div>
            <div className="flex flex-row gap-3">
              <ExportExcel/>
            </div>
          </div>
          <div className="flex flex-row ml-auto gap-3">
            <Calender />
            <AddTodo 
              setTaskCallBack={setTaskCallBack} 
              pageSize={pageSize} 
              page={page} 
              filter={filter} 
              sort={sort} 
              filterComplete={filterComplete} 
            />
          </div>
        </div>

        <div className="flex flex-row justify-between mb-5">
          <div>
            <div className="flex flex-row gap-3">
            <Input placeholder="Description" onChange={(e) => setFilter(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-row ml-auto gap-3">
            <FilterComplete setfilterCompleteCallBack={setfilterCompleteCallBack} />
            <PageSize setPageCallBack={setPageCallBack} setPageSizeCallBack={setPageSizeCallBack} />
            <SortDate setSortDateCallBack={setSortDateCallBack} />
          </div>
        </div>

        <TodoList
          setTaskCallBack={setTaskCallBack} 
          tasks={tasks} 
          pageSize={pageSize} 
          page={page} 
          filter={filter} 
          sort={sort} 
          filterComplete={filterComplete} 
        />
        <PageList setPageCallBack={setPageCallBack} page={page} pageSize={pageSize} totalTask={totalTask} />
      </div>
    </main>
  );
}
