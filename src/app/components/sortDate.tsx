import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

export default function sortDate({ setSortDateCallBack}: { setSortDateCallBack:(sortDate: string|null) => void}) {
    return (
      <Select defaultValue="null" onValueChange={(value) =>  setSortDateCallBack(value === "null" ? null : value)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by due date order</SelectLabel>
            <SelectItem value="null">-----</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }