import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'

export default async function MesaEntradaPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.roles.length === 0) redirect('/error')
  if (!user.roles.includes('MESA_ENTRADA')) redirect('/error')

  return (
    <main className="flex-1 p-5 md:p-8">
      <div className="w-full space-y-4">
        {/* Header section */}
        <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mesa de Entrada</h1>
              <p className="text-lg text-gray-600">Panel principal de gestión administrativa y atención al paciente</p>
            </div>
          </div>
        </section>

        {/* Main action cards - Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Gestión de Pacientes */}
          <Link href="/mesa-entrada/pacientes" className="group">
            <div className="rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-emerald-200 h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Pacientes</h3>
              <p className="text-sm text-gray-600">Administrar el registro completo de pacientes, historiales y datos personales</p>
            </div>
          </Link>

          {/* Turnos */}
          <Link href="/mesa-entrada/turnos" className="group">
            <div className="rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200 h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-2xl">�</span>
                </div>
                <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Turnos</h3>
              <p className="text-sm text-gray-600">Agendar, reprogramar y administrar citas médicas y horarios de atención</p>
            </div>
          </Link>

          {/* Pagos */}
          <Link href="/mesa-entrada/pagos" className="group">
            <div className="rounded-2xl border border-amber-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-amber-200 h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-2xl">�</span>
                </div>
                <div className="text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Administración de Pagos</h3>
              <p className="text-sm text-gray-600">Registrar pagos, facturación y gestión financiera del consultorio</p>
            </div>
          </Link>

          {/* Reportes */}
          <Link href="/mesa-entrada/reportes" className="group">
            <div className="rounded-2xl border border-purple-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-purple-200 h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-2xl">�</span>
                </div>
                <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reportes y Estadísticas</h3>
              <p className="text-sm text-gray-600">Visualizar métricas, generar reportes y análisis de gestión</p>
            </div>
          </Link>

          {/* Lista de Turnos */}
          <Link href="/mesa-entrada/lista-turnos" className="group">
            <div className="rounded-2xl border border-teal-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-teal-200 h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lista de Turnos</h3>
              <p className="text-sm text-gray-600">Consultar y gestionar la lista completa de turnos programados</p>
            </div>
          </Link>

          {/* Configuración */}
          <Link href="/mesa-entrada/configuracion" className="group">
            <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuración</h3>
              <p className="text-sm text-gray-600">Ajustar parámetros del sistema y preferencias de usuario</p>
            </div>
          </Link>
        </div>

        {/* Quick actions section */}
        <div className="rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accesos Rápidos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/mesa-entrada/pacientes" className="group">
              <div className="p-4 rounded-xl border border-gray-100 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200 text-center">
                <div className="text-3xl mb-2">🆕</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">Nuevo Paciente</div>
              </div>
            </Link>
            <Link href="/mesa-entrada/turnos" className="group">
              <div className="p-4 rounded-xl border border-gray-100 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 text-center">
                <div className="text-3xl mb-2">�</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Agendar Turno</div>
              </div>
            </Link>
            <Link href="/mesa-entrada/pagos" className="group">
              <div className="p-4 rounded-xl border border-gray-100 bg-white hover:bg-amber-50 hover:border-amber-200 transition-all duration-200 text-center">
                <div className="text-3xl mb-2">💳</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-amber-700">Registrar Pago</div>
              </div>
            </Link>
            <Link href="/mesa-entrada/lista-turnos" className="group">
              <div className="p-4 rounded-xl border border-gray-100 bg-white hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 text-center">
                <div className="text-3xl mb-2">�</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Ver Lista</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
