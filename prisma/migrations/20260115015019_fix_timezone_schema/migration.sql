-- AlterTable
ALTER TABLE "public"."ObraSocial" ALTER COLUMN "fechaHoraObraSocial" SET DEFAULT NOW() - INTERVAL '3 hours';
