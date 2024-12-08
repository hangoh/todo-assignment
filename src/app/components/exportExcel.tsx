import { Button } from "@/components/ui/button"
import { FolderUp } from "lucide-react"
import ExcelJS from "exceljs" 

import { getAllTasks } from "../db"

export default function ExportExcel() {
  const exportDataToExcel = async () => {
    const taskData = await getAllTasks()

    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet("To Do Task")

    const columns = Object.keys(taskData[0]).map(key => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key: key,
      width: 20,
    }))
    worksheet.columns = columns

    taskData.forEach((task) => {
      worksheet.addRow(task)
    })

    const buffer = await workbook.xlsx.writeBuffer()

    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "todo_export.xlsx"
    link.click()
  }

  const handleExport = () => {
    console.log("Exporting data to Excel...")
    exportDataToExcel()
  }

  return (
    <Button type="button" className="bg-white text-gray-500 border hover:bg-gray-100" onClick={handleExport}>
      <FolderUp />
    </Button>
  )
}