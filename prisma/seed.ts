// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed para Obras Sociales...')

  // Borramos datos viejos para evitar duplicados al probar
  await prisma.obraSocial.deleteMany()

  // Creamos datos usando los nombres EXACTOS de tu schema
  await prisma.obraSocial.createMany({
    data: [
      {
        nombreObraSocial: 'OSDE',
        estadoObraSocial: true
      },
      {
        nombreObraSocial: 'Swiss Medical',
        estadoObraSocial: true
      },
      {
        nombreObraSocial: 'OSECAC',
        estadoObraSocial: false // Ejemplo de inactiva
      }
    ]
  })

  console.log('✅ Se insertaron las obras sociales correctamente.')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })