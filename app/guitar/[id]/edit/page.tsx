import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import GuitarForm from "@/app/guitar/new/GuitarForm";

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
        <h1 className="text-4xl font-light mb-8">Modifier une guitare</h1>
        <GuitarForm mode="edit" guitar={guitar} />
      </div>
    </div>
  );
}
