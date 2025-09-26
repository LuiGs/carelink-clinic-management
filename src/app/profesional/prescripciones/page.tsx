export default function PrescripcionesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Prescripciones Médicas</h1>
        <p className="text-gray-600">Gestiona recetas y prescripciones para tus pacientes</p>
      </div>

      <div className="bg-white rounded-lg border p-8 text-center">
        <div className="text-6xl mb-4">💊</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Próximamente</h2>
        <p className="text-gray-600 mb-4">El módulo de prescripciones estará disponible pronto</p>
        <div className="text-sm text-gray-500">
          <p>Funcionalidades planificadas:</p>
          <ul className="mt-2 space-y-1">
            <li>• Recetas digitales</li>
            <li>• Histórico de medicamentos</li>
            <li>• Alertas de interacciones</li>
            <li>• Prescripción de tratamientos</li>
            <li>• Renovación de recetas</li>
          </ul>
        </div>
      </div>
    </div>
  )
}