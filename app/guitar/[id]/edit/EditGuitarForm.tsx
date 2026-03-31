"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Guitar = {
  id: number;
  name: string;
  type: string;
  year: number;
  description: string;
  imageUrl: string;
  videoId: string;
  price: number;
  body: string;
  neck: string;
  pickups: string;
  hardware: string;
};

type Props = {
  guitar: Guitar;
};

export default function EditGuitarForm({ guitar }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: guitar.name,
    type: guitar.type,
    year: String(guitar.year),
    description: guitar.description,
    imageUrl: guitar.imageUrl,
    videoId: guitar.videoId,
    price: String(guitar.price),
    body: guitar.body,
    neck: guitar.neck,
    pickups: guitar.pickups,
    hardware: guitar.hardware,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/guitars/${guitar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la modification");
      }

      router.push("/manage");
      router.refresh();
    } catch (err) {
      setError("Impossible de modifier la guitare");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nom"
        className="w-full p-4 bg-zinc-900 border border-white/10"
      />
      <input
        name="type"
        value={form.type}
        onChange={handleChange}
        placeholder="Type"
        className="w-full p-4 bg-zinc-900 border border-white/10"
      />
      <input
        name="year"
        value={form.year}
        onChange={handleChange}
        placeholder="Année"
        className="w-full p-4 bg-zinc-900 border border-white/10"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-4 bg-zinc-900 border border-white/10 min-h-32"
      />
      <input
        name="imageUrl"
        value={form.imageUrl}
        onChange={handleChange}
        placeholder="Image URL"
        className="w-full p-4 bg-zinc-900 border border-white/10"
      />
      <input
        name="videoId"
        value={form.videoId}
        onChange={handleChange}
        placeholder="Video ID YouTube"
        className="w-full p-4 bg-zinc-900 border border-white/10"
      />
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Prix"
        className="w-full p-4 bg-zinc-900 border border-white/10"
      />
      <input
        name="body"
        value={form.body}
        onChange={handleChange}
        placeholder="Body"
        className="w-full p-4 bg-zinc-900 border border-white/10"
      />
      <input
        name="neck"
        value={form.neck}
        onChange={handleChange}
        placeholder="Neck"
        className="w-full p-4 bg-zinc-900 border border-white/10"
      />
      <input
        name="pickups"
        value={form.pickups}
        onChange={handleChange}
        placeholder="Pickups"
        className="w-full p-4 bg-zinc-900 border border-white/10"
      />
      <input
        name="hardware"
        value={form.hardware}
        onChange={handleChange}
        placeholder="Hardware"
        className="w-full p-4 bg-zinc-900 border border-white/10"
      />

      {error && <p className="text-red-400">{error}</p>}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Modification..." : "Enregistrer"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/manage")}
          className="px-6 py-3 bg-white/10 hover:bg-white/20"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
