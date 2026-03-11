import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const updates = [
    { id: 1, videoId: 'OkHD4OVjS4E' },
    { id: 4, videoId: '6RAKXNAiY2Y' },
    { id: 2, videoId: 'DSBBEDAGOTc' },
    { id: 6, videoId: 'po4GAzP0kHU' },
    { id: 9, videoId: 'po4GAzP0kHU' },
    { id: 7, videoId: 'po4GAzP0kHU' },
    { id: 10, videoId: 'po4GAzP0kHU' },
    { id: 3, videoId: 'po4GAzP0kHU' },
    { id: 5, videoId: 'bIVCQPe8ey0' },
  ]

  for (const u of updates) {
    await prisma.guitar.update({
      where: { id: u.id },
      data: { videoId: u.videoId },
    })
  }

  console.log('✅ Videos mises à jour')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
