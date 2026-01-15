import { CreateObraSocialDto } from "@/app/api/obras-sociales/dto/create-obra-social.dto"
import { UpdateObraSocialDto } from "@/app/api/obras-sociales/dto/update-obra-social.dto"
import { ObraSocial } from "@/types/obraSocial"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function fetchObrasApi(): Promise<ObraSocial[]> {
    const request = await fetch("/api/obras-sociales")
    const response = await request.json()
    if(response.error) throw new Error(response.error)
    return response
}


export async function createObraSocial(createObraSocialDto:CreateObraSocialDto){
  const {nombreObraSocial} = createObraSocialDto
  const request = await fetch("api/obras-sociales",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({nombreObraSocial:nombreObraSocial})
  })

  const response = await request.json()

  if(response.error) throw new Error(response.error)
  return response

}

export async function updateObraSocial(updateObraSocial:UpdateObraSocialDto){
  const {nombreObraSocial,id} = updateObraSocial
  const request = await fetch(`api/obras-sociales/${id}`,{
    method:"PATCH",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({nombreObraSocial:nombreObraSocial})
  })

  const response = await request.json()
  if(response.error) throw new Error(response.error)
  return response

}

export async function deleteObraSocial(id:number){
  const request = await fetch(`api/obras-sociales/${id}`,{
    method:"DELETE",
    headers:{
      "Content-Type":"application/json"
    }
  })

  const response = await request.json()
  console.log(response)
  if(response.error) throw new Error(response.error)
  return response

}