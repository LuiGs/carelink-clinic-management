import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, signIn } from '@/lib/auth'

export default async function MesaEntradaLoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await getCurrentUser()

  if (user && user.role === 'MESA_ENTRADA') {
    redirect('/mesa-entrada')
  }

  async function handleSignIn(formData: FormData) {
    'use server'
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    console.log('[AUTH] signIn attempt', { email })
    
    try {
      const user = await signIn(email, password)
      
      if (user && user.role === 'MESA_ENTRADA') {
        redirect('/mesa-entrada')
      } else if (user && user.role !== 'MESA_ENTRADA') {
        // Usuario válido pero rol incorrecto
        redirect('/login/mesa-entrada?error=role')
      } else {
        redirect('/login/mesa-entrada?error=credentials')
      }
    } catch (error) {
      console.error('[AUTH] signIn error:', error)
      redirect('/login/mesa-entrada?error=credentials')
    }
  }

  async function handleRegister(formData: FormData) {
    'use server'
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    
    console.log('[AUTH] register attempt', { email, name })
    
    redirect('/login/mesa-entrada?registration=pending')
  }

  const error = searchParams?.error
  const registration = searchParams?.registration

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-green-200">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            Mesa de Entrada
          </h2>
          <p className="text-green-600">
            Recepción y atención al paciente
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
            Su cuenta no tiene permisos de mesa de entrada.
          </div>
        )}

        {registration === 'pending' && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            Registro pendiente de aprobación por administración.
          </div>
        )}

        {/* Login Form */}
        <form action={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-green-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/70"
              placeholder="recepcion@ejemplo.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-green-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/70"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-lg"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Register Form */}
        <div className="border-t border-green-200 pt-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 text-center">
            ¿No tienes cuenta?
          </h3>
          
          <form action={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-green-700 mb-2">
                Nombre completo
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                required
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/70"
                placeholder="María García"
              />
            </div>
            
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-green-700 mb-2">
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/70"
                placeholder="recepcion@ejemplo.com"
              />
            </div>
            
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-green-700 mb-2">
                Contraseña
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/70"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-lg"
            >
              Registrarse
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link 
            href="/" 
            className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
