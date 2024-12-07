"use client"

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function pageList({setPageCallBack, page, pageSize, totalTask}:{setPageCallBack:(page:number)=>void, page:number, pageSize:number, totalTask:number}) {
    const [totalPage, setTotalPage] = useState(1)

    useEffect(()=>{
        const totalPage = Math.ceil(totalTask/pageSize)
        setTotalPage(totalPage)
    },[page, pageSize, totalTask])

    const handlePreviousPage = () => {
        setPageCallBack(page-1)
    }

    const handleNextPage = () => {
        setPageCallBack(page+1)
    }

    return(
        <div className="flex flex-row item-center justify-center gap-4">
            {
                page+1==1
                ?<Button type="button" className="bg-white text-gray-500 border hover:bg-gray-100" disabled>Previous</Button>
                :<Button type="button" className="bg-white text-gray-500 border hover:bg-gray-100" onClick={handlePreviousPage}>Previous</Button>
            }
            <div className="justify-center">
                <Button className="bg-white text-black font-bold text-1xl shadow-none" disabled> {page+1}/{totalPage} </Button>
            </div>
            {
                page+1==totalPage
                ?<Button type="button" className="bg-white text-gray-500 border hover:bg-gray-100" disabled>Next</Button>
                :<Button type="button" className="bg-white text-gray-500 border hover:bg-gray-100" onClick={handleNextPage}>Next</Button>
            }
            
        </div>
    )
}