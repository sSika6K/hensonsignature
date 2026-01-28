import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const guitars = [
    {
      name: 'THBB10',
      type: 'electric',
      year: 2019,
      description: 'La première guitare signature de Tim Henson, basée sur la série AZ d\'Ibanez. Connue pour son hardware doré et son design Black Beauty élégant.',
      imageUrl: '/images/thbb10.jpg',
      videoId: '3ppGMmqp_w4',
      price: 1599,
      body: 'Alder',
      neck: 'Roasted Maple',
      pickups: 'DiMarzio Notorious',
      hardware: 'Gold'
    },
    {
      name: 'TOD10N',
      type: 'nylon',
      year: 2022,
      description: 'La célèbre guitare nylon électro-acoustique utilisée sur Playing God et Ego Death. Profil ultra-fin avec soundhole latéral et repères Tree of Death.',
      imageUrl: '/images/tod10n.jpg',
      videoId: '3ppGMmqp_w4',
      price: 899,
      body: 'Sapele',
      neck: 'Nyatoh',
      pickups: 'Fishman Sonicore + Under Saddle',
      hardware: 'Black'
    },
    {
      name: 'TOD100N',
      type: 'nylon',
      year: 2026,
      description: 'Version premium du TOD10N lancée en 2026, avec finitions haut de gamme et électronique améliorée.',
      imageUrl: '/images/tod100n.jpg',
      videoId: '3ppGMmqp_w4',
      price: 1299,
      body: 'Solid Spruce Top / Sapele Back & Sides',
      neck: 'African Mahogany',
      pickups: 'Fishman Premium System',
      hardware: 'Gold'
    }
  ]

  for (const guitar of guitars) {
    await prisma.guitar.upsert({
      where: { name: guitar.name },
      update: {},
      create: guitar
    })
  }

  console.log('✅ 3 guitares ajoutées à la base de données!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
