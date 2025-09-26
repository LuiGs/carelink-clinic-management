import { redirect } from 'next/navigation'
import { signIn, getCurrentUser, roleToPath } from '@/lib/auth'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function loginAction(formData: FormData) {
  'use server'
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const res = await signIn(email, password)
  if (!res.ok) {
    redirect('/login/profesionales?error=1')
  }
  // If role is null, redirect to home or a safe default
  if (!res.user.role) {
    redirect('/')
  }
  redirect(roleToPath(res.user.role))
}

async function registerAction(_formData: FormData) {
  'use server'
  // TODO: Implement registration logic here
  redirect('/login/profesionales?registration=pending')
}

export default async function ProfesionalesLoginPage({ searchParams }: { searchParams: Promise<{ error?: string, registration?: string }> }) {
  const user = await getCurrentUser()
  if (user) {
    if (!user.role) {
      redirect('/')
    }
    redirect(roleToPath(user.role))
  }

  const sp = await searchParams
  const hasError = !!sp?.error
  const registrationPending = sp?.registration === 'pending'

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 text-gray-900 relative overflow-hidden"
    >
      {/* Blurred background image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/doctor-icon-virtual-screen-health-care-and-medical-on-background-copy-space-free-photo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(8px)',
          zIndex: 0,
        }}
      />
      {/* Gradient overlay with blue theme */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.7) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(59, 130, 246, 0.7) 100%)',
          zIndex: 1,
        }}
      />
      <div className="w-full max-w-md flex flex-col bg-white rounded-xl shadow-xl border border-gray-200 px-0 pt-0 pb-0 bg-opacity-95 backdrop-blur-sm relative" style={{zIndex:2}}>
        {/* Header específico para Profesionales */}
        <div className="bg-blue-600 rounded-t-xl px-6 py-5 flex flex-col items-center">
          <div className="mb-2">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Profesionales</h1>
          <p className="text-sm text-blue-100 mb-0">Acceso para médicos y especialistas</p>
        </div>
        
        <div className="px-6 pt-6 pb-8">
          {hasError && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800 border border-red-200 text-center">
              Credenciales inválidas. Intenta nuevamente.
            </div>
          )}
          
          {registrationPending && (
            <div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 border border-yellow-200 text-center">
              Registro pendiente de implementación.
            </div>
          )}

          <form action={loginAction} className="flex flex-col items-center">
            <div className="w-full max-w-sm flex flex-col">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 shadow-sm"
                placeholder="profesional@carelink.com"
              />
            </div>
            <div className="w-full max-w-sm flex flex-col mt-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 shadow-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="mt-6 max-w-sm w-full sm:w-auto bg-blue-600 text-white py-2.5 px-8 rounded-lg hover:bg-blue-700 transition shadow-md font-semibold text-base"
            >
              Iniciar sesión
            </button>
          </form>

          <div className="mt-6 text-center">
            <form action={registerAction} className="inline">
              <button
                type="submit"
                className="text-blue-700 font-medium hover:underline text-sm"
              >
                ¿No tienes cuenta? Crear nueva cuenta
              </button>
            </form>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-gray-600 text-sm hover:underline">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
