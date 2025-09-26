import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, signIn } from '@/lib/auth'

export default async function ProfesionalesLoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await getCurrentUser()

  if (user && user.role === 'PROFESIONAL') {
    redirect('/profesional')
  }

  async function handleSignIn(formData: FormData) {
    'use server'
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    console.log('[AUTH] signIn attempt', { email })
    
    try {
      const user = await signIn(email, password)
      
      if (user && user.role === 'PROFESIONAL') {
        redirect('/profesional')
      } else if (user && user.role !== 'PROFESIONAL') {
        // Usuario válido pero rol incorrecto
        redirect('/login/profesionales?error=role')
      } else {
        redirect('/login/profesionales?error=credentials')
      }
    } catch (error) {
      console.error('[AUTH] signIn error:', error)
      redirect('/login/profesionales?error=credentials')
    }
  }

  async function handleRegister(formData: FormData) {
    'use server'
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    
    console.log('[AUTH] register attempt', { email, name })
    
    redirect('/login/profesionales?registration=pending')
  }

  const error = searchParams?.error
  const registration = searchParams?.registration

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-blue-200">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.5 2V22H12.5V2H11.5Z"/>
              <path d="M12 22L12 2M9 4.5C7.3 4.5 6 5.8 6 7.5C6 9.2 7.3 10.5 9 10.5C10.7 10.5 12 9.2 12 7.5M15 13.5C16.7 13.5 18 12.2 18 10.5C18 8.8 16.7 7.5 15 7.5C13.3 7.5 12 8.8 12 10.5"/>
              <path d="M9 10.5C9.8 11.3 10.8 12 12 12.5C13.2 13 14.2 13.7 15 14.5" stroke="currentColor" strokeWidth="0.5" fill="none"/>
              <path d="M15 7.5C14.2 8.3 13.2 9 12 9.5C10.8 10 9.8 10.7 9 11.5" stroke="currentColor" strokeWidth="0.5" fill="none"/>
              <circle cx="9" cy="7.5" r="1.5"/>
              <circle cx="15" cy="10.5" r="1.5"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-blue-800 mb-2">
            Profesionales
          </h2>
          <p className="text-blue-600">
            Médicos y especialistas
          </p>
        </div>

        {/* Error Messages */}
        {error === 'credentials' && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            Credenciales incorrectas. Por favor, intente nuevamente.
          </div>
        )}
        
        {error === 'role' && (
          <div className="bg-orange-50 border border-orange-200 text-orange-600 px-4 py-3 rounded-lg">
            Su cuenta no tiene permisos de profesional.
          </div>
        )}

        {registration === 'pending' && (
          <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg">
            Registro pendiente de aprobación por administración.
          </div>
        )}

        {/* Login Form */}
        <form action={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
              placeholder="profesional@ejemplo.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-blue-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-lg"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Register Form */}
        <div className="border-t border-blue-200 pt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 text-center">
            ¿No tienes cuenta?
          </h3>
          
          <form action={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-blue-700 mb-2">
                Nombre completo
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                required
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
                placeholder="Dr. Juan Pérez"
              />
            </div>
            
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-blue-700 mb-2">
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
                placeholder="profesional@ejemplo.com"
              />
            </div>
            
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-blue-700 mb-2">
                Contraseña
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-lg"
            >
              Registrarse
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
