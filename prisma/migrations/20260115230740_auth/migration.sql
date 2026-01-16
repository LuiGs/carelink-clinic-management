-- AlterTable
ALTER TABLE "public"."ObraSocial" ALTER COLUMN "fechaHoraObraSocial" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."Paciente" (
    "idPaciente" SERIAL NOT NULL,
    "nombrePaciente" TEXT NOT NULL,
    "apellidoPaciente" TEXT NOT NULL,
    "telefonoPaciente" TEXT,
    "domicilioPaciente" TEXT,
    "dniPaciente" TEXT NOT NULL,
    "fechaHoraPaciente" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estadoPaciente" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("idPaciente")
);

-- CreateTable
CREATE TABLE "public"."Consultas" (
    "idConsulta" SERIAL NOT NULL,
    "motivoConsulta" TEXT NOT NULL,
    "diagnosticoConsulta" TEXT,
    "tratamientoConsulta" TEXT,
    "fechaHoraConsulta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idPaciente" INTEGER NOT NULL,
    "idObraSocial" INTEGER NOT NULL,

    CONSTRAINT "Consultas_pkey" PRIMARY KEY ("idConsulta")
);

-- CreateTable
CREATE TABLE "public"."PacienteXObra" (
    "idPacientexObra" SERIAL NOT NULL,
    "idPaciente" INTEGER NOT NULL,
    "idObraSocial" INTEGER NOT NULL,

    CONSTRAINT "PacienteXObra_pkey" PRIMARY KEY ("idPacientexObra")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_dniPaciente_key" ON "public"."Paciente"("dniPaciente");

-- CreateIndex
CREATE INDEX "Consultas_idPaciente_idx" ON "public"."Consultas"("idPaciente");

-- CreateIndex
CREATE INDEX "Consultas_idObraSocial_idx" ON "public"."Consultas"("idObraSocial");

-- CreateIndex
CREATE INDEX "PacienteXObra_idObraSocial_idx" ON "public"."PacienteXObra"("idObraSocial");

-- CreateIndex
CREATE UNIQUE INDEX "PacienteXObra_idPaciente_idObraSocial_key" ON "public"."PacienteXObra"("idPaciente", "idObraSocial");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "public"."Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "public"."Consultas" ADD CONSTRAINT "Consultas_idPaciente_fkey" FOREIGN KEY ("idPaciente") REFERENCES "public"."Paciente"("idPaciente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Consultas" ADD CONSTRAINT "Consultas_idObraSocial_fkey" FOREIGN KEY ("idObraSocial") REFERENCES "public"."ObraSocial"("idObraSocial") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PacienteXObra" ADD CONSTRAINT "PacienteXObra_idPaciente_fkey" FOREIGN KEY ("idPaciente") REFERENCES "public"."Paciente"("idPaciente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PacienteXObra" ADD CONSTRAINT "PacienteXObra_idObraSocial_fkey" FOREIGN KEY ("idObraSocial") REFERENCES "public"."ObraSocial"("idObraSocial") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
