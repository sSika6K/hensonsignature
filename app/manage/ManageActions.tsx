"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [items, setItems] = useState(guitars);
  const [error, setError] = useState("");

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Supprimer cette guitare ?");
    if (!confirmed) return;

    setLoadingId(id);
    setError("");

    const previousItems = items;
    setItems((current) => current.filter((guitar) => guitar.id !== id));

    try {
      const response = await fetch(`/api/guitars/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setItems(previousItems);
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Impossible de supprimer la guitare");
      }

      router.refresh();
    } catch (err) {
      setItems(previousItems);
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer la guitare",
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors text-sm"
        >
          Se déconnecter
        </button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid gap-4">
        {items.map((guitar) => (
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
                disabled={loadingId === guitar.id}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 transition-colors text-sm"
              >
                {loadingId === guitar.id ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
