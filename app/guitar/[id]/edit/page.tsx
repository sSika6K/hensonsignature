import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import GuitarForm from "@/app/guitar/new/GuitarForm";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditGuitarPage({ params }: PageProps) {
  const { id } = await params;
  const guitarId = Number(id);

  if (!Number.isInteger(guitarId) || guitarId <= 0) {
    notFound();
  }

  const guitar = await prisma.guitar.findUnique({
    where: { id: guitarId },
  });

  if (!guitar) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl font-light">Modifier une guitare</h1>
          <Link
            href="/collection"
            className="inline-flex items-center justify-center px-5 py-2 bg-white/10 hover:bg-white/20 transition-colors text-sm tracking-widest uppercase"
          >
            ← Retour
          </Link>
        </div>
        <GuitarForm mode="edit" guitar={guitar} />
      </div>
    </div>
  );
}
