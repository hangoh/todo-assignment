import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function FilterComplete({ setfilterCompleteCallBack}: { setfilterCompleteCallBack:(filterComplete: boolean|null) => void}) {
    return (
      <Select defaultValue="null" onValueChange={(value) =>  setfilterCompleteCallBack(value === "null" ? null : value === "true"? true : false)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Filter by completion status</SelectLabel>
            <SelectItem value="null">-----</SelectItem>
            <SelectItem value="true">Show Complete</SelectItem>
            <SelectItem value="false">Show Incomplete</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }