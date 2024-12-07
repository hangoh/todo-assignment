"use client"

import { Button } from "@/components/ui/button"
import { FolderUp } from "lucide-react"
import { utils, writeFile } from "xlsx"

import { getAllTasks } from "../db"

export default function exportExcel(){
    const exportDataToExcel = async ()=>{
        const taskData = await getAllTasks()

        const worksheet = utils.json_to_sheet(taskData)
        const workbook = utils.book_new()

        utils.book_append_sheet(workbook, worksheet, "To Do Task")
        writeFile(workbook, "todo_export.xlsx")
    }

    const handleExport = ()=>{
        console.log("Exporting data to Excel...")
        exportDataToExcel()
    }

    return (
        <Button type="button" className="bg-white text-gray-500 border hover:bg-gray-100" onClick={handleExport} ><FolderUp /></Button>
    )
}