import { redirect } from 'next/navigation'
import { getCurrentUser, roleToPath } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) {
    if (!user.role) {
      redirect('/')
    }
    redirect(roleToPath(user.role))
  }

  // Redirect to the main page where users can choose their login type
  redirect('/')
}
