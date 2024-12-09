import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CircleAlert, CloudUpload } from "lucide-react"
import ExcelJS from "exceljs" 
import { addTask, getTasks } from "../db"
import { Task } from "../type"
import { categories, categoryColors } from "../utils"
import { Separator } from "@/components/ui/separator"
  
export default function ImportTodo({ setTaskCallBack, pageSize, page, filter, sort, filterComplete }: { setTaskCallBack:(tasks: Task[]|null) => void, pageSize:number, page:number, filter:string, sort:string|null, filterComplete:boolean|null}) {
    const [open, setOpenChange] = useState(false)
    const titles = ["id", "description", "category", "duedate", "iscompleted"]

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Importing Data...")
        const files = event.target.files
        const reader = new FileReader();
        if (files && files.length > 0) {
            const file = files[0]

            if (file.type == "text/csv"){
                reader.readAsArrayBuffer(file)
                reader.onload = async (event) => {
                    if(event.target){
                        const arrayBuffer = event.target.result as ArrayBuffer;
                        const dataArray = readCsvFile(arrayBuffer)
                        await handleGenerateData(dataArray)
                    }
                }
            } else {
                reader.readAsArrayBuffer(file)
                reader.onload = async (event) => {
                    if(event.target){
                        const arrayBuffer = event.target.result as ArrayBuffer;
                        const dataArray = await readExcelFile(arrayBuffer);
                        await handleGenerateData(dataArray)
                    }
                }

            }
        }
        setOpenChange(false)
    }

    const readExcelFile = async (arrayBuffer: ArrayBuffer) => {
        const workbook = new ExcelJS.Workbook();
        const rows: { [key: string]: string | number | boolean }[] = [];

        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.getWorksheet(1);

        if (worksheet) {
            const firstRow = worksheet.getRow(1);

            if (firstRow && firstRow.values) {
                const headerValues = (firstRow.values as string[]).slice(1); 
                headerValues.forEach((value: string, index: number) => { headerValues[index] = value.toLowerCase() })
                if (headerValues.every(header => titles.includes(header)) && headerValues.length>=3 && headerValues.length <=5) {
                    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                        if (rowNumber > 1) { 
                            const rowData = (row.values as (string | number | boolean)[]).slice(1);
                            const data: { [key: string]: string | number | boolean } = {};
                            headerValues.forEach((value: string, index: number) => { data[value] = rowData[index] });
                            rows.push(data);
                        }
                    });
                }
            }
        }

        return rows
    }

    const readCsvFile = (arrayBuffer:ArrayBuffer) => {
        const rows: { [key: string]: string | number | boolean }[] = [];
        const decoder = new TextDecoder('utf-8');
        const csvContent = decoder.decode(arrayBuffer);
        const csvRows = csvContent.split('\n');

        if (csvRows.length>=2) {
            const firstRow = csvRows.splice(0, 1)[0]
            const headerValues:string[] = firstRow.split(","); 
            headerValues.forEach((value: string, index: number) => { headerValues[index] = value.trim().toLowerCase() })
            if (headerValues.every(header => titles.includes(header)) && headerValues.length>=3 && headerValues.length <=5) {
                csvRows.forEach((csvdata:string)=>{
                    const rowData = csvdata.split(",");
                    if (rowData.length == headerValues.length){
                        const data: { [key: string]: string | number | boolean } = {};
                        headerValues.forEach((value: string, index: number) => { data[value] = rowData[index] });
                        rows.push(data);
                    }
                })
            }
        }

        return rows
    }

    const handleGenerateData = async(dataArray:{ [key: string]: string | number | boolean }[])=>{
        dataArray.forEach((data: { [key: string]: string | number | boolean }) => {
            if( 
                (data["description"] == "" || data["category"] == "" || data['duedate'] == "") ||
                (data["description"] == null || data["category"] == null || data['duedate'] == null) ||
                (data["description"] == undefined || data["category"] == undefined || data['duedate'] == undefined)
             ){
                return
            }
            addTask({
                id: 0,
                description: (data["description"] as string).trim(),
                category: categories.includes((data["category"] as string).trim())?(data["category"] as string).trim():categories[0],
                dueDate: (data['duedate'] as string).trim(),
                isCompleted: "iscompleted" in data?data["iscompleted"].toString().trim().toLowerCase() == "true"||data["iscompleted"] == true?true:false:false,
            })
        })
        async function fetchTasks() {
            const fetchedTasks = await getTasks(pageSize, page, filter, sort, filterComplete )
            setTaskCallBack(fetchedTasks)
        }
        fetchTasks()
    }

    return (
        <Dialog open={open} onOpenChange={setOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline"><CloudUpload /></Button>
            </DialogTrigger>
            <DialogContent className="min-w-[600px]">
                <DialogHeader>
                <DialogTitle>Import To Do</DialogTitle>
                <DialogDescription>
                    Import To Do Task(s) in Excel or CSV format
                </DialogDescription>
                </DialogHeader>
                    <Alert variant={"note"}>
                        <AlertTitle>
                            <div className="flex flex-row items-center gap-2">
                                <CircleAlert />
                                <span className="font-bold text-2xl">Note</span>
                            </div>
                        </AlertTitle>
                        <AlertDescription>
                            <div>
                                The first row of Excel(.xlsx) or CSV(.csv) file must be the header row in the following format and name.
                            </div>
                            <div className="font-bold">
                            [description, category, duedate, iscompleted] 
                            </div>
                            * iscompleted is optional
                            <Separator className="m-2 bg-blue-800"/>
                            <div>
                                Category must be one of the following (Case Sensitive):
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {
                                    categories.map((category) => (
                                        <div className="flex flex-row gap-1 items-center" key={category}>
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[category as keyof typeof categoryColors] }}></div>
                                            <div>{category}</div>
                                        </div>
                                    ))
                                }
                            </div>
                            <Separator className="m-2 bg-blue-800"/>
                            <div>

                                duedate must be in the following format: [YYYY-MM-DD] e,g. {new Date().toISOString().split('T')[0]}
                            </div>
                        </AlertDescription>
                    </Alert>
                    <Input 
                        id="toDoFile" 
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        onChange={handleFileUpload}
                        className="border-2 border-black rounded-md"
                    />
            </DialogContent>
        </Dialog>
    )
}