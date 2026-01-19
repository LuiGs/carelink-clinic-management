"use client";

import type { PacienteConObras } from "@/types/pacienteConObras";
import PacienteCard from "@/components/pacientes/pacienteCard";
import PacientesMobileTable from "@/components/pacientes/pacientesMobileTable";

type ListaPacientesProps = {
  pacientes: PacienteConObras[];
  onVerHistoria?: (idPaciente: number) => void;
  onChanged?: () => void;

  onEditSuccess?: () => void;
};

export default function ListaPacientes({
  pacientes,
  onVerHistoria,
  onChanged,
  onEditSuccess,
}: ListaPacientesProps) {
  if (!pacientes || pacientes.length === 0) {
    return (
      <div className="rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground">
        No hay pacientes para mostrar.
      </div>
    );
  }

  return (
    <>
      {/* Mobile: tabla/lista */}
      <div className="md:hidden">
        <PacientesMobileTable
          pacientes={pacientes}
          onVerHistoria={onVerHistoria}
          onChanged={onChanged}
          onEditSuccess={onEditSuccess}
        />
      </div>

      {/* Desktop/Tablet: cards */}
      <div className="hidden md:grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {pacientes.map((p) => (
          <PacienteCard
            key={p.idPaciente}
            paciente={p}
            onVerHistoria={onVerHistoria}
            onChanged={onChanged}
            onEditSuccess={onEditSuccess}
          />
        ))}
      </div>
    </>
  );
}
