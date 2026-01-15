-- CreateTable
CREATE TABLE "public"."ObraSocial" (
    "idObraSocial" SERIAL NOT NULL,
    "nombreObraSocial" TEXT NOT NULL,
    "estadoObraSocial" BOOLEAN NOT NULL DEFAULT true,
    "fechaHoraObraSocial" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ObraSocial_pkey" PRIMARY KEY ("idObraSocial")
);

-- CreateIndex
CREATE UNIQUE INDEX "ObraSocial_nombreObraSocial_key" ON "public"."ObraSocial"("nombreObraSocial");
