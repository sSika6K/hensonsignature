import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function GuitarDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const guitar = await prisma.guitar.findUnique({
    where: { id: parseInt(resolvedParams.id) }
  })

  if (!guitar) notFound()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
              <Image src="/timsignaturepurplefade.png" alt="Tim Henson" fill className="object-contain" />
            </div>
            <span className="text-xl font-light tracking-[0.2em]">SIGNATURE COLLECTION</span>
          </Link>
          <Link href="/" className="text-xs tracking-widest hover:text-purple-400 transition-colors">
            ← BACK TO COLLECTION
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24">
        <div className="max-w-[1600px] mx-auto px-6 py-16">
          {/* Title */}
          <div className="mb-16">
            <p className="text-xs tracking-[0.3em] text-purple-400 mb-4">
              {guitar.type.toUpperCase()} GUITAR
            </p>
            <h1 className="text-6xl md:text-8xl font-extralight mb-4">{guitar.name}</h1>
            <p className="text-2xl text-white/60">{guitar.year} — {guitar.price}€</p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Image */}
            <div className="lg:col-span-7">
              <div className="aspect-[3/4] relative bg-zinc-900">
                <Image
                  src={guitar.imageUrl}
                  alt={guitar.name}
                  fill
                  className="object-contain p-12"
                />
              </div>
            </div>

            {/* Right: Info */}
            <div className="lg:col-span-5 space-y-12">
              {/* Description */}
              <div>
                <h2 className="text-xs tracking-[0.3em] text-purple-400 mb-6">DESCRIPTION</h2>
                <p className="text-lg leading-relaxed text-white/80 font-light">
                  {guitar.description}
                </p>
              </div>

              {/* Specs */}
              <div>
                <h2 className="text-xs tracking-[0.3em] text-purple-400 mb-6">SPECIFICATIONS</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Body', value: guitar.body },
                    { label: 'Neck', value: guitar.neck },
                    { label: 'Pickups', value: guitar.pickups },
                    { label: 'Hardware', value: guitar.hardware }
                  ].map((spec) => (
                    <div key={spec.label} className="flex justify-between border-b border-white/10 pb-4">
                      <span className="text-sm text-white/50 tracking-wider">{spec.label}</span>
                      <span className="text-sm font-light text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video */}
              <div>
                <h2 className="text-xs tracking-[0.3em] text-purple-400 mb-6">SOUND DEMO</h2>
                <div className="aspect-video bg-zinc-900">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${guitar.videoId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-24">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <p className="text-sm text-white/40 tracking-widest">
            © 2026 TIM HENSON SIGNATURE COLLECTION
          </p>
        </div>
      </footer>
    </div>
  )
}
