import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function MesaEntradaPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.roles.length === 0) redirect('/error')
  if (!user.roles.includes('MESA_ENTRADA')) redirect('/error')

  // Obtener datos en tiempo real para el dashboard
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const manana = new Date(hoy)
  manana.setDate(manana.getDate() + 1)

  const [turnosHoy, turnosProgramados, turnosConfirmados, proximosTurnos] = await Promise.all([
    prisma.appointment.count({
      where: { fecha: { gte: hoy, lt: manana } }
    }),
    prisma.appointment.count({
      where: { fecha: { gte: hoy, lt: manana }, estado: 'PROGRAMADO' }
    }),
    prisma.appointment.count({
      where: { fecha: { gte: hoy, lt: manana }, estado: 'CONFIRMADO' }
    }),
    // Próximos 5 turnos de hoy (no cancelados)
    prisma.appointment.findMany({
      where: {
        fecha: { gte: new Date(), lt: manana },
        estado: { notIn: ['CANCELADO', 'NO_ASISTIO'] }
      },
      include: {
        paciente: { select: { nombre: true, apellido: true, dni: true } },
        profesional: { select: { name: true, apellido: true } }
      },
      orderBy: { fecha: 'asc' },
      take: 5
    })
  ])

  return (
    <main className="flex-1 p-5 md:p-8">
      <div className="w-full space-y-4">
        {/* Header con saludo personalizado y resumen */}
        <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Hola, {user.name?.split(' ')[0] || 'Usuario'}! 👋
              </h1>
              <p className="text-lg text-gray-600">
                {new Date().getHours() < 12 ? 'Buenos días' : new Date().getHours() < 18 ? 'Buenas tardes' : 'Buenas noches'} • {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Turnos de hoy</div>
              <div className="text-4xl font-bold text-emerald-600">{turnosHoy}</div>
            </div>
          </div>
        </section>

        {/* KPIs del día en tiempo real */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
            <div className="text-xs font-medium text-blue-600 uppercase mb-1">Programados</div>
            <div className="text-2xl font-bold text-gray-900">{turnosProgramados}</div>
            <div className="text-xs text-gray-500 mt-1">Pendientes confirmar</div>
          </div>
          
          <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">
            <div className="text-xs font-medium text-emerald-600 uppercase mb-1">Confirmados</div>
            <div className="text-2xl font-bold text-gray-900">{turnosConfirmados}</div>
            <div className="text-xs text-gray-500 mt-1">Asistirán hoy</div>
          </div>
          
          <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-4">
            <div className="text-xs font-medium text-purple-600 uppercase mb-1">Ocupación</div>
            <div className="text-2xl font-bold text-gray-900">
              {turnosHoy > 0 ? Math.round((turnosConfirmados / turnosHoy) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500 mt-1">De la agenda</div>
          </div>
        </div>

        {/* Próximos Turnos - Vista de lo que viene */}
        {proximosTurnos.length > 0 && (
          <div className="rounded-2xl border border-blue-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">🕐 Próximos Turnos</h2>
              <Link 
                href="/mesa-entrada/lista-turnos" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Ver todos →
              </Link>
            </div>
            <div className="space-y-3">
              {proximosTurnos.map((turno) => {
                const hora = turno.fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                const estadoConfig = {
                  CONFIRMADO: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Confirmado' },
                  PROGRAMADO: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Programado' },
                  EN_SALA_DE_ESPERA: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'En espera' },
                  COMPLETADO: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Completado' }
                }
                const config = estadoConfig[turno.estado as keyof typeof estadoConfig] || { bg: 'bg-gray-100', text: 'text-gray-700', label: turno.estado }

                return (
                  <div 
                    key={turno.id} 
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex flex-col items-center justify-center text-white shadow-sm">
                        <div className="text-xs font-medium">{hora.split(':')[0]}</div>
                        <div className="text-lg font-bold leading-none">{hora.split(':')[1]}</div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 truncate">
                          {turno.paciente.nombre} {turno.paciente.apellido}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        Dr/a. {turno.profesional.name} {turno.profesional.apellido}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">DNI: {turno.paciente.dni}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Acciones Rápidas - Lo que más usa Mesa de Entrada */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/mesa-entrada/turnos" className="group">
            <div className="p-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Agendar Turno</h3>
              </div>
              <p className="text-sm text-gray-600">Crear nueva cita médica para un paciente</p>
            </div>
          </Link>

          <Link href="/mesa-entrada/lista-turnos" className="group">
            <div className="p-6 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Agenda del Día</h3>
              </div>
              <p className="text-sm text-gray-600">Ver, confirmar y gestionar todos los turnos</p>
            </div>
          </Link>

          <Link href="/mesa-entrada/pacientes" className="group">
            <div className="p-6 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Buscar Paciente</h3>
              </div>
              <p className="text-sm text-gray-600">Consultar datos, historial y obra social</p>
            </div>
          </Link>
        </div>

        {/* Otras Secciones - Acceso rápido */}
        <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Otras Secciones</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/mesa-entrada/pagos" className="group p-4 rounded-xl border border-gray-100 bg-white hover:bg-amber-50 hover:border-amber-200 transition-all text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-sm font-medium text-gray-700 group-hover:text-amber-700">Pagos</div>
            </Link>
            
            <Link href="/mesa-entrada/reportes" className="group p-4 rounded-xl border border-gray-100 bg-white hover:bg-purple-50 hover:border-purple-200 transition-all text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Reportes</div>
            </Link>

            <Link href="/mesa-entrada/configuracion" className="group p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-center">
              <div className="text-3xl mb-2">⚙️</div>
              <div className="text-sm font-medium text-gray-700">Configuración</div>
            </Link>

            <Link href="/mesa-entrada/perfil" className="group p-4 rounded-xl border border-gray-100 bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-all text-center">
              <div className="text-3xl mb-2">👤</div>
              <div className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">Mi Perfil</div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
