import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import type { JWT } from "next-auth/jwt";

// Tipos para el resultado de verificación
type AuthSuccess = {
  error: false;
  status: 200;
  session: JWT;
  response?: never;
};

type AuthError = {
  error: true;
  status: 401 | 500;
  session: null;
  response: Response;
};

type AuthResult = AuthSuccess | AuthError;

/**
 * Función para verificar autenticación en API routes
 * Uso: const auth = await verifyAuth(req);
 * if (auth.error) return auth.response;
 */
export async function verifyAuth(req: NextRequest): Promise<AuthResult> {
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      return {
        error: true,
        status: 401,
        session: null,
        response: NextResponse.json(
          { error: "No autenticado. Por favor, inicia sesión." },
          { status: 401 }
        ),
      };
    }

    return {
      error: false,
      status: 200,
      session: token as JWT,
    };
  } catch (error) {
    console.error("Error verifying auth:", error);
    return {
      error: true,
      status: 500,
      session: null,
      response: NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      ),
    };
  }
}

/**
 * Wrapper para proteger funciones de API routes
 * Uso:
 * export const GET = withAuth(async (req, { session }) => {
 *   // Tu código aquí
 * });
 */
export function withAuth<T extends Record<string, unknown>>(
  handler: (req: NextRequest, context: { session: JWT } & T) => Promise<Response>
) {
  return async (req: NextRequest, context?: T) => {
    const { error, status, session } = await verifyAuth(req);

    if (error) {
      return NextResponse.json(
        { error: "No autenticado. Por favor, inicia sesión." },
        { status }
      );
    }

    const mergedContext = {
      session,
      ...context,
    } as { session: JWT } & T;
    
    return handler(req, mergedContext);
  };
}
