
import CreateModalObraSocialComponent from "./createModalObraSocial";

export default function HeaderComponent({ onRefresh }: { onRefresh: () => void }){
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Obras Sociales</h1>
            <p className="text-slate-500 mt-1">
                Gestiona los convenios y coberturas disponibles en el sistema.
            </p>
            </div>
            <CreateModalObraSocialComponent onSuccess={onRefresh} />
      </div>
    )
}