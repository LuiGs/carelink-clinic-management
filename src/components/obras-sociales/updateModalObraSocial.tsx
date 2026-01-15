"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputsCreateObraSocial } from "@/types/inputsCreateObraSocial"
import {  Loader2, FileEdit } from "lucide-react"
import { useForm, SubmitHandler } from "react-hook-form"
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import NotifySuccessComponent from "./notifySuccess"
import { updateObraSocial } from "@/lib/utils"

export default function UpdateModalObraSocialComponent({idObraSocial,onSuccess}:{onSuccess:()=>void,idObraSocial:number}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [openNotify, setOpenNotify] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputsCreateObraSocial>()

  const onSubmit: SubmitHandler<InputsCreateObraSocial> = async (data) => {
    try {
      setIsLoading(true)
      
      console.log(typeof(data.name))
      await updateObraSocial({nombreObraSocial:data.name, id:idObraSocial}) 
      onSuccess()
      
      setOpenNotify(true)
      
      setOpen(false) 
      reset()

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
         description="La obra social ha sido editada correctamente." 
      />

      <AlertDialog open={open} onOpenChange={setOpen}>
       <AlertDialogTrigger asChild>
          <div className="flex w-full cursor-pointer items-center px-2 py-1.5 text-sm hover:bg-slate-100 text-slate-900 rounded-sm">
            <FileEdit className="mr-2 h-4 w-4" /> 
            Editar
          </div>
      </AlertDialogTrigger>
        
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Obra Social</AlertDialogTitle>
          </AlertDialogHeader>

          <form id="create-obra-form" onSubmit={handleSubmit(onSubmit)} className="py-4">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="nombre">Nuevo Nombre</FieldLabel>
                  <Input
                    id="nombre"
                    placeholder="Ej: Nobis Medical"
                    disabled={isLoading} 
                    className={`focus-visible:ring-cyan-500 focus-visible:border-cyan-500 ${
                        errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                    {...register("name", { required: true })} 
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            {errors.name && (
              <span className="text-red-500 text-sm mt-1 block">
                El nombre es obligatorio
              </span>
            )}
          </form>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading} className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600">
              Cancelar
            </AlertDialogCancel>
            
            <Button 
              type="submit" 
              form="create-obra-form"
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}