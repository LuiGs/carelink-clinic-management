export default function EstudiosPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Estudios Médicos</h1>
        <p className="text-gray-600">Gestiona órdenes de estudios para pacientes</p>
      </div>

      <div className="bg-white rounded-lg border p-8 text-center">
        <div className="text-6xl mb-4">🔬</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Próximamente</h2>
        <p className="text-gray-600 mb-4">La gestión de estudios estará disponible pronto</p>
        <div className="text-sm text-gray-500">
          <p>Funcionalidades planificadas:</p>
          <ul className="mt-2 space-y-1">
            <li>• Solicitud de estudios</li>
            <li>• Registro de resultados</li>
            <li>• Análisis de laboratorio</li>
            <li>• Estudios por imágenes</li>
            <li>• Historial de estudios por paciente</li>
          </ul>
        </div>
      </div>
    </div>
  )
}