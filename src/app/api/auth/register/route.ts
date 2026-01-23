import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

// Validaciones de contraseña
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]/;

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password: string): { valid: boolean; error?: string } {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { 
      valid: false, 
      error: `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres` 
    };
  }
  
  if (!PASSWORD_REGEX.test(password)) {
    return { 
      valid: false, 
      error: "La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales" 
    };
  }
  
  return { valid: true };
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Normalizar email
    const normalizedEmail = email.toString().toLowerCase().trim();

    // Validar formato de email
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Validar contraseña
    const passwordValidation = isValidPassword(password.toString());
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Validar nombre
    if (name && typeof name !== "string") {
      return NextResponse.json(
        { error: "Nombre inválido" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 409 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name?.trim() || normalizedEmail.split("@")[0],
        role: "USER",
      },
    });

    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error al procesar el registro" },
      { status: 500 }
    );
  }
}
