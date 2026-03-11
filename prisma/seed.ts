import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const guitars = [
    {
      name: 'THBB10',
      type: 'electric',
      year: 2019,
      description: 'La première guitare signature de Tim Henson, basée sur la série AZ d\'Ibanez. Connue pour son hardware doré et son design Black Beauty élégant. Modèle iconique discontinué en 2022.',
      imageUrl: '/images/thbb10.jpg',
      videoId: '3ppGMmqp_w4',
      price: 1599,
      body: 'Alder',
      neck: 'Roasted Maple',
      pickups: 'DiMarzio Notorious',
      hardware: 'Gold'
    },
    {
      name: 'TOD10',
      type: 'electric',
      year: 2022,
      description: 'Guitare électrique signature avec l\'iconique inlay "Tree of Death". Équipée des micros Fishman Fluence signature avec 3 voicings différents. American Basswood body pour un son naturel et plat.',
      imageUrl: '/images/tod10.jpg',
      videoId: 'Mtd24QIBJ5Y',
      price: 1499,
      body: 'American Basswood',
      neck: 'Roasted Maple',
      pickups: 'Fishman Fluence Tim Henson Signature',
      hardware: 'Gotoh T1502 tremolo'
    },
    {
      name: 'TOD70',
      type: 'electric',
      year: 2024,
      description: 'Version premium du TOD10 lancée en 2024. Offre des finitions haut de gamme et des améliorations électroniques pour les guitaristes exigeants.',
      imageUrl: '/images/tod70.jpg',
      videoId: 'Mtd24QIBJ5Y',
      price: 1899,
      body: 'American Basswood Premium',
      neck: 'Roasted Maple',
      pickups: 'Fishman Fluence Tim Henson Signature',
      hardware: 'Gotoh Premium Hardware'
    },
    {
      name: 'TOD10N',
      type: 'nylon',
      year: 2022,
      description: 'La célèbre guitare nylon électro-acoustique utilisée sur Playing God et Ego Death. Profil ultra-fin avec soundhole latéral et repères Tree of Death. Micros Fishman pour un son nylon authentique amplifié.',
      imageUrl: '/images/tod10n.jpg',
      videoId: 'krTW99oWQR0',
      price: 899,
      body: 'Sapele',
      neck: 'Nyatoh',
      pickups: 'Fishman Sonicore + Under Saddle',
      hardware: 'Black'
    },
    {
      name: 'TOD10N White',
      type: 'nylon',
      year: 2023,
      description: 'Version blanche du célèbre TOD10N. Même construction ultra-fine et même son légendaire, dans une finition white pearl élégante et moderne.',
      imageUrl: '/images/tod10n-white.jpg',
      videoId: 'krTW99oWQR0',
      price: 899,
      body: 'Sapele',
      neck: 'Nyatoh',
      pickups: 'Fishman Sonicore + Under Saddle',
      hardware: 'Black'
    },
    {
      name: 'TOD10N Pink',
      type: 'nylon',
      year: 2024,
      description: 'Édition limitée rose du TOD10N. Un modèle unique et audacieux qui conserve toutes les caractéristiques sonores du modèle original avec une esthétique distinctive.',
      imageUrl: '/images/tod10n-pink.jpg',
      videoId: 'krTW99oWQR0',
      price: 949,
      body: 'Sapele',
      neck: 'Nyatoh',
      pickups: 'Fishman Sonicore + Under Saddle',
      hardware: 'Chrome'
    },
    {
      name: 'TOD20FMN',
      type: 'nylon',
      year: 2024,
      description: 'Modèle intermédiaire de la série nylon avec table flamed maple. Offre un équilibre parfait entre qualité et prix avec des finitions améliorées et un son plus riche.',
      imageUrl: '/images/tod20fmn.jpg',
      videoId: 'krTW99oWQR0',
      price: 1199,
      body: 'Flamed Maple Top / Sapele Back & Sides',
      neck: 'Nyatoh',
      pickups: 'Fishman Sonicore Plus + Under Saddle',
      hardware: 'Gold'
    },
    {
      name: 'TOD100N',
      type: 'nylon',
      year: 2025,
      description: 'Version haut de gamme du TOD10N avec construction premium et électronique améliorée. Table en épicéa massif pour une projection sonore exceptionnelle.',
      imageUrl: '/images/tod100n.jpg',
      videoId: 'krTW99oWQR0',
      price: 1499,
      body: 'Solid Spruce Top / Sapele Back & Sides',
      neck: 'African Mahogany',
      pickups: 'Fishman Premium System',
      hardware: 'Gold'
    },
    {
      name: 'TOD100FMN',
      type: 'nylon',
      year: 2025,
      description: 'Le modèle ultime de la série nylon. Table flamed maple premium avec électronique Fishman haut de gamme. Construction artisanale pour les professionnels exigeants.',
      imageUrl: '/images/tod100fmn.jpg',
      videoId: 'krTW99oWQR0',
      price: 1699,
      body: 'Premium Flamed Maple Top / Solid Sapele Back & Sides',
      neck: 'African Mahogany',
      pickups: 'Fishman Matrix Infinity + Sonicore',
      hardware: 'Gold Premium'
    }
  ]

  for (const guitar of guitars) {
    await prisma.guitar.upsert({
      where: { name: guitar.name },
      update: {},
      create: guitar
    })
  }

  console.log('✅ 9 guitares Tim Henson ajoutées à la base de données!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
