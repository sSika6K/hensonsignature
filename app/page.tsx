import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
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
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          <p className="text-sm tracking-[0.4em] text-purple-400 uppercase mb-4">
            Bienvenue
          </p>
          <h1 className="text-5xl md:text-7xl font-extralight tracking-tight mb-6">
            Tim Henson Signature Guitars
          </h1>

          <Link
            href="/collection"
            className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-500 transition-colors text-sm tracking-widest uppercase rounded-lg"
          >
            Entrer dans la collection
          </Link>
        </div>
      </main>
    </div>
  );
}
