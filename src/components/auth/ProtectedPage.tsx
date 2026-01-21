"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedPageProps {
  children: ReactNode;
  /** 
   * Componente de carga personalizado (opcional)
   * Si no se proporciona, muestra el spinner por defecto
   */
  loadingComponent?: ReactNode;
}

/**
 * Componente para proteger páginas que requieren autenticación
 * Redirige a /auth/login si el usuario no está autenticado
 */
export function ProtectedPage({ children, loadingComponent }: ProtectedPageProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Mientras se verifica la sesión o redirigiendo
  if (isLoading || !isAuthenticated) {
    return loadingComponent ?? (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-cyan-900 via-cyan-950 to-cyan-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-cyan-200 rounded-full animate-spin"></div>
          <p className="text-cyan-200 font-medium tracking-wide">Cargando Dermacor...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
