"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

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

const isValidImageUrl = (value: string) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const normalizeYouTubeVideoId = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) return "";

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
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

const uploadImageToSupabase = async (file: File) => {
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "png";
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `guitars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("guitars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from("guitars").getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error("Impossible de récupérer l'URL publique de l'image");
  }

  return data.publicUrl;
};

export default function EditGuitarForm({ guitar }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const publicUrl = await uploadImageToSupabase(file);
      setForm((prev) => ({ ...prev, imageUrl: publicUrl }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer l'image vers Supabase Storage",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const normalizedVideoId = normalizeYouTubeVideoId(form.videoId);
    const normalizedImageUrl = form.imageUrl.trim();

    if (
      !form.name.trim() ||
      !form.type.trim() ||
      !form.year.trim() ||
      !form.description.trim() ||
      !normalizedImageUrl ||
      !normalizedVideoId ||
      !form.price.trim() ||
      !form.body.trim() ||
      !form.neck.trim() ||
      !form.pickups.trim() ||
      !form.hardware.trim()
    ) {
      setError("Merci de remplir tous les champs");
      setLoading(false);
      return;
    }

    if (
      !isValidImageUrl(normalizedImageUrl) &&
      !normalizedImageUrl.startsWith("/")
    ) {
      setError("L'URL de l'image n'est pas valide");
      setLoading(false);
      return;
    }

    if (!normalizedVideoId) {
      setError("Le lien ou l'identifiant YouTube n'est pas valide");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/guitars/${guitar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          imageUrl: normalizedImageUrl,
          videoId: normalizedVideoId,
        }),
      });

      if (!response.ok) {
        let message = "Erreur lors de la modification";
        try {
          const data = await response.json();
          if (data?.message) message = data.message;
        } catch {
          // ignore parsing errors
        }
        throw new Error(message);
      }

      router.push("/manage");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de modifier la guitare",
      );
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

      <div className="space-y-3">
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="URL de l'image"
          className="w-full p-4 bg-zinc-900 border border-white/10"
        />
        <div className="flex items-center gap-3">
          <label className="px-4 py-2 bg-white/10 hover:bg-white/20 cursor-pointer text-sm">
            {uploading ? "Upload..." : "Choisir une image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <span className="text-sm text-white/50">
            L'image sera envoyée vers Supabase Storage
          </span>
        </div>
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

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || uploading}
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
