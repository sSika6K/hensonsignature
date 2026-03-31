"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const isValidYouTubeId = (value: string) => /^[a-zA-Z0-9_-]{11}$/.test(value);

const normalizeYouTubeVideoId = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) return "";

  if (isValidYouTubeId(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);

    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "").split("/")[0];
      return id?.slice(0, 11) ?? "";
    }

    if (url.hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v");
      if (videoId) return videoId.slice(0, 11);

      const parts = url.pathname.split("/");
      const lastPart = parts[parts.length - 1];
      if (lastPart) return lastPart.slice(0, 11);
    }
  } catch {
    return "";
  }

  return "";
};

const isValidImageName = (value: string) => {
  const trimmed = value.trim().toLowerCase();
  return /\.(png|jpg|jpeg|webp|gif)$/i.test(trimmed);
};

export default function NewGuitarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "electric",
    year: "",
    description: "",
    imageFile: null as File | null,
    videoId: "",
    price: "",
    body: "",
    neck: "",
    pickups: "",
    hardware: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({
      ...prev,
      imageFile: file,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (
        !form.name.trim() ||
        !form.type.trim() ||
        !form.year.trim() ||
        !form.description.trim() ||
        !form.imageFile ||
        !form.videoId.trim() ||
        !form.price.trim() ||
        !form.body.trim() ||
        !form.neck.trim() ||
        !form.pickups.trim() ||
        !form.hardware.trim()
      ) {
        setError("Merci de remplir tous les champs");
        return;
      }

      if (!isValidImageName(form.imageFile.name)) {
        setError(
          "Le fichier image doit être au format PNG, JPG, JPEG, WEBP ou GIF",
        );
        return;
      }

      const normalizedVideoId = normalizeYouTubeVideoId(form.videoId);
      if (!normalizedVideoId) {
        setError("Le lien ou l'identifiant YouTube n'est pas valide");
        return;
      }

      const fileExt = form.imageFile.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `guitars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("guitars")
        .upload(filePath, form.imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("guitars")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      const response = await fetch("/api/guitars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          type: form.type.trim(),
          year: form.year.trim(),
          description: form.description.trim(),
          imageUrl,
          videoId: normalizedVideoId,
          price: form.price.trim(),
          body: form.body.trim(),
          neck: form.neck.trim(),
          pickups: form.pickups.trim(),
          hardware: form.hardware.trim(),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || "Erreur lors de la création");
      }

      router.push("/manage");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible d'ajouter la guitare",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-light mb-8">Ajouter une guitare</h1>

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

          <div className="space-y-2">
            <label className="block text-sm text-white/70">
              Image de la guitare
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-4 bg-zinc-900 border border-white/10"
            />
          </div>

          <input
            name="videoId"
            value={form.videoId}
            onChange={handleChange}
            placeholder="ID YouTube ou lien YouTube"
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

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer la guitare"}
          </button>
        </form>
      </div>
    </div>
  );
}
