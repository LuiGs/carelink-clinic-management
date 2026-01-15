import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input"; 
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SearcherProps {
  setSearchTerm: (value: string) => void;
  setStatusFilter: (value: string) => void;
  searchTerm: string;
}

export default function SearcherObraSocialComponent({
  setSearchTerm,
  setStatusFilter,
  searchTerm
}: SearcherProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Buscar por nombre o código..."
          className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-cyan-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-[180px]">
        <Select defaultValue="ALL" onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full focus:ring-cyan-500">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <SelectValue placeholder="Estado" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los estados</SelectItem>
            <SelectItem value="ACTIVA">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-500" /> Activas
              </span>
            </SelectItem>
            <SelectItem value="INACTIVA">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" /> Inactivas
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}