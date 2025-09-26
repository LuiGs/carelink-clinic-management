import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, signIn } from '@/lib/auth'

export default async function GerenciaLoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await getCurrentUser()

  if (user && user.role === 'GERENTE') {
    redirect('/gerente')
  }

  async function handleSignIn(formData: FormData) {
    'use server'
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    console.log('[AUTH] signIn attempt', { email })
    
    try {
      const user = await signIn(email, password)
      
      if (user && user.role === 'GERENTE') {
        redirect('/gerente')
      } else if (user && user.role !== 'GERENTE') {
        // Usuario válido pero rol incorrecto
        redirect('/login/gerencia?error=role')
      } else {
        redirect('/login/gerencia?error=credentials')
      }
    } catch (error) {
      console.error('[AUTH] signIn error:', error)
      redirect('/login/gerencia?error=credentials')
    }
  }

  async function handleRegister(formData: FormData) {
    'use server'
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    
    console.log('[AUTH] register attempt', { email, name })
    
    redirect('/login/gerencia?registration=pending')
  }

  const error = searchParams?.error
  const registration = searchParams?.registration

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-purple-200">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-purple-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
              <path d="M21 9V7L15 6.5C14.8 6.2 14.5 6 14.2 6H9.8C9.5 6 9.2 6.2 9 6.5L3 7V9H4V16C4 17.1 4.9 18 6 18H8V20C8 21.1 8.9 22 10 22H14C15.1 22 16 21.1 16 20V18H18C19.1 18 20 17.1 20 16V9H21ZM18 16H6V8H7.5L8 7.5H16L16.5 8H18V16Z"/>
              <rect x="9" y="9" width="6" height="1"/>
              <rect x="10" y="11" width="4" height="1"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-purple-800 mb-2">
            Gerencia
          </h2>
          <p className="text-purple-600">
            Administración y gestión del sistema
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
            Su cuenta no tiene permisos de gerencia.
          </div>
        )}

        {registration === 'pending' && (
          <div className="bg-purple-50 border border-purple-200 text-purple-600 px-4 py-3 rounded-lg">
            Registro pendiente de aprobación por administración.
          </div>
        )}

        {/* Login Form */}
        <form action={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-purple-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/70"
              placeholder="gerente@ejemplo.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-purple-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/70"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-lg"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Register Form */}
        <div className="border-t border-purple-200 pt-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-4 text-center">
            ¿No tienes cuenta?
          </h3>
          
          <form action={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-purple-700 mb-2">
                Nombre completo
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                required
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/70"
                placeholder="Juan Pérez"
              />
            </div>
            
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-purple-700 mb-2">
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/70"
                placeholder="gerente@ejemplo.com"
              />
            </div>
            
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-purple-700 mb-2">
                Contraseña
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/70"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-lg"
            >
              Registrarse
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link 
            href="/" 
            className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
