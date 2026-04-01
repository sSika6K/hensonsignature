export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const guitars = await prisma.guitar.findMany({
    orderBy: { year: "desc" },
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
              <Image
                src="/timsignaturepurplefade.png"
                alt="Tim Henson"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-light tracking-[0.2em]">
              SIGNATURE COLLECTION
            </span>
          </div>

          <nav className="flex items-center gap-4 text-sm tracking-widest">
            <Link
              href="/manage"
              className="inline-flex items-center justify-center px-5 py-2 bg-white/10 hover:bg-white/20 transition-colors uppercase"
            >
              Gestion
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-24">
        <div className="max-w-[1400px] mx-auto px-6 py-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-6xl md:text-8xl font-extralight tracking-tight mb-4">
              TIM HENSON
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/60 tracking-wide">
              Signature Guitar Series
            </p>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {guitars.map((guitar) => (
              <Link href={`/guitar/${guitar.id}`} key={guitar.id}>
                <div className="group relative overflow-hidden bg-zinc-900 hover:bg-zinc-800 transition-all duration-700">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={guitar.imageUrl}
                      alt={guitar.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs tracking-[0.3em] text-purple-400 mb-2">
                          {guitar.type.toUpperCase()}
                        </p>
                        <h2 className="text-4xl font-light mb-2">
                          {guitar.name}
                        </h2>
                        <p className="text-sm text-white/50">{guitar.year}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-light">{guitar.price}€</p>
                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs tracking-widest text-purple-400">
                            VIEW →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-12">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <p className="text-sm text-white/40 tracking-widest">
            © 2026 TIM HENSON SIGNATURE COLLECTION
          </p>
        </div>
      </footer>
    </div>
  );
}
