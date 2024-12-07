import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

export default function pageSize({setPageSizeCallBack}: {setPageSizeCallBack:(pageSize: number) => void}) {
    return (
      <Select defaultValue="5" onValueChange={(value) => setPageSizeCallBack(parseInt(value))}>
        <SelectTrigger className="w-[75px]">
          <SelectValue placeholder="Page Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Page Size</SelectLabel>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }