import Link from "next/link";
import GuitarForm from "./GuitarForm";

export default function NewGuitarPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-4xl font-light">Ajouter une guitare</h1>
          <Link
            href="/collection"
            className="inline-flex items-center justify-center px-5 py-2 bg-white/10 hover:bg-white/20 transition-colors text-sm tracking-widest uppercase"
          >
            ← Retour
          </Link>
        </div>

        <GuitarForm mode="create" />
      </div>
    </div>
  );
}
