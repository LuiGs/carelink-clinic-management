import { 
  MoreHorizontal, 
  Building2, 
  Loader2
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ObraSocial } from '@/types/obraSocial' 
import UpdateModalObraSocialComponent from './updateModalObraSocial'
import { useState } from 'react'
import { deleteObraSocial } from '@/lib/utils'
import NotifySuccessComponent from './notifySuccess'

export default function ListadoObraSocial({ obras , onRefresh}: { obras: ObraSocial[],onRefresh:()=>void }) {
  const [loadingDelete,setIsLoading] = useState(false)
    const [openNotify, setOpenNotify] = useState(false)

  const handleDelete = async(idObraSocial:number)=>{
    try {
          setIsLoading(true)
          await deleteObraSocial(idObraSocial) 
          onRefresh()
          setOpenNotify(true)
        
    
          setTimeout(() => {
            setOpenNotify(false)
          }, 2000)
    
        } catch (error) {
          console.error(error)
          alert("Hubo un error al guardar.")
        } finally {
          setIsLoading(false)
        }
  }

  return (
    <>
    <NotifySuccessComponent 
             open={openNotify} 
             title="Éxito" 
             description="La obra social ha sido eliminada correctamente." 
             />
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle>Listado General</CardTitle>
        <CardDescription>
          Visualiza y administra las {obras.length} obras sociales registradas.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Fecha y hora</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {obras.length > 0 ? (
                obras.map((obra) => (
                  <TableRow key={obra.idObraSocial} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-slate-900">{obra.nombreObraSocial}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={obra.estadoObraSocial ? "outline" : "secondary"}
                        className={obra.estadoObraSocial
                          ? "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100"
                          : "bg-slate-100 text-slate-500 border-transparent shadow-none"
                        }
                        >
                        {obra.estadoObraSocial ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500 text-sm">
                      {String(obra.fechaHoraObraSocial).split("T")[0] + " " + String(obra.fechaHoraObraSocial).split("T")[1].split(".")[0]}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                            <UpdateModalObraSocialComponent idObraSocial={obra.idObraSocial} onSuccess={onRefresh} ></UpdateModalObraSocialComponent>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={(e)=>e.preventDefault()} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                            <Button 
                              type="submit" 
                              form="create-obra-form"
                              disabled={loadingDelete}
                              className="bg-cyan-600 hover:bg-cyan-700 text-white min-w-[100px]"
                              onClick={()=>handleDelete(obra.idObraSocial)}
                            >
                              {loadingDelete ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Eliminando
                                </>
                              ) : (
                                "Eliminar"
                              )}
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
    </>
  )
}