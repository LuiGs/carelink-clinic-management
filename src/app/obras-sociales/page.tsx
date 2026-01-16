'use client'

import { useState } from 'react'
import HeaderComponent from '@/components/obras-sociales/header'
import SearcherObraSocialComponent from '@/components/obras-sociales/searcherObraSocial' // Revisa ruta
import { useObraSocial } from '@/hooks/useObras'
import ListadoObraSocial from '@/components/obras-sociales/listaObraSocial'
import SkeletonListObraSocialComponent from '@/components/obras-sociales/skeletonListObraSocial'

export default function ObrasSocialesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const { obras, loading, error, refrescar } = useObraSocial()

if (loading) return (
     <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
        <HeaderComponent onRefresh={() => {}} />
        <SearcherObraSocialComponent 
           searchTerm={searchTerm} 
           setSearchTerm={setSearchTerm} 
           setStatusFilter={setStatusFilter} 
        />
        <SkeletonListObraSocialComponent />
     </div>
  )

    if (error) return <div className="p-8 text-red-500">{error}</div>

  const filteredObras = obras.filter((obra) => {
    const matchesSearch = obra.nombreObraSocial.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' 
      ? true 
      : statusFilter === 'ACTIVA' 
        ? obra.estadoObraSocial 
        : !obra.estadoObraSocial

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      
      <HeaderComponent onRefresh={refrescar}/>
      <SearcherObraSocialComponent 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        setStatusFilter={setStatusFilter} 
      />
      <ListadoObraSocial onRefresh={refrescar} obras={filteredObras} />
      
    </div>
  )
}