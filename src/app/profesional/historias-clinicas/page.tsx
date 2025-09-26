export default function HistoriasClinicasPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Historias Clínicas</h1>
        <p className="text-gray-600">Administra los historiales médicos de tus pacientes</p>
      </div>

      <div className="bg-white rounded-lg border p-8 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Próximamente</h2>
        <p className="text-gray-600 mb-4">La gestión de historias clínicas estará disponible pronto</p>
        <div className="text-sm text-gray-500">
          <p>Funcionalidades planificadas:</p>
          <ul className="mt-2 space-y-1">
            <li>• Registro de consultas</li>
            <li>• Historial médico completo</li>
            <li>• Antecedentes clínicos</li>
            <li>• Notas de evolución</li>
            <li>• Documentos adjuntos</li>
          </ul>
        </div>
      </div>
    </div>
  )
}