"use client";

import Link from "next/link";

type Guitar = {
  id: number;
  name: string;
  type: string;
  year: number;
  price: number;
};

type Props = {
  guitars: Guitar[];
};

export default function ManageActions({ guitars }: Props) {
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Supprimer cette guitare ?");
    if (!confirmed) return;

    await fetch(`/api/guitars/${id}`, {
      method: "DELETE",
    });

    window.location.reload();
  };

  return (
    <div className="grid gap-4">
      {guitars.map((guitar) => (
        <div
          key={guitar.id}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 bg-zinc-900 border border-white/10 rounded-lg"
        >
          <div>
            <h2 className="text-xl font-light">{guitar.name}</h2>
            <p className="text-sm text-white/50">
              {guitar.type} • {guitar.year} • {guitar.price}€
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/guitar/${guitar.id}`}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              Voir
            </Link>
            <Link
              href={`/guitar/${guitar.id}/edit`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 transition-colors text-sm"
            >
              Modifier
            </Link>
            <button
              onClick={() => handleDelete(guitar.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 transition-colors text-sm"
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
