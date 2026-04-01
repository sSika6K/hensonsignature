"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Guitar = {
  id?: number;
  name: string;
  type: string;
  year: number | string;
  description: string;
  imageUrl: string;
  videoId: string;
  price: number | string;
  body: string;
  neck: string;
  pickups: string;
  hardware: string;
};

type GuitarFormProps = {
  mode: "create" | "edit";
  guitar?: Guitar;
};

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

const isValidImageUrl = (value: string) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
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

export default function GuitarForm({ mode, guitar }: GuitarFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: guitar?.name ?? "",
    type: guitar?.type ?? "electric",
    year: guitar?.year ? String(guitar.year) : "",
    description: guitar?.description ?? "",
    imageUrl: guitar?.imageUrl ?? "",
    videoId: guitar?.videoId ?? "",
    price: guitar?.price ? String(guitar.price) : "",
    body: guitar?.body ?? "",
    neck: guitar?.neck ?? "",
    pickups: guitar?.pickups ?? "",
    hardware: guitar?.hardware ?? "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

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

    if (!isValidImageUrl(normalizedImageUrl)) {
      setError("L'URL de l'image n'est pas valide");
      setLoading(false);
      return;
    }

    if (!normalizedVideoId) {
      setError("Le lien ou l'identifiant YouTube n'est pas valide");
      setLoading(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      type: form.type.trim(),
      year: form.year.trim(),
      description: form.description.trim(),
      imageUrl: normalizedImageUrl,
      videoId: normalizedVideoId,
      price: form.price.trim(),
      body: form.body.trim(),
      neck: form.neck.trim(),
      pickups: form.pickups.trim(),
      hardware: form.hardware.trim(),
    };

    try {
      const response =
        mode === "edit" && guitar?.id
          ? await fetch(`/api/guitars/${guitar.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            })
          : await fetch("/api/guitars", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Une erreur est survenue");
      }

      setSuccess(mode === "edit" ? "Guitare modifiée" : "Guitare ajoutée");
      router.push("/manage");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
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
        className="w-full p-4 bg-zinc-900 border border-white/10 rounded-lg outline-none focus:border-purple-500"
      />

      <input
        name="type"
        value={form.type}
        onChange={handleChange}
        placeholder="Type"
        className="w-full p-4 bg-zinc-900 border border-white/10 rounded-lg outline-none focus:border-purple-500"
      />

      <input
        name="year"
        value={form.year}
        onChange={handleChange}
        placeholder="Année"
        type="number"
        className="w-full p-4 bg-zinc-900 border border-white/10 rounded-lg outline-none focus:border-purple-500"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-4 bg-zinc-900 border border-white/10 rounded-lg outline-none focus:border-purple-500 min-h-32"
      />

      <div className="space-y-3">
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="URL de l'image"
          className="w-full p-4 bg-zinc-900 border border-white/10 rounded-lg outline-none focus:border-purple-500"
        />

        <div className="flex items-center gap-3">
          <label className="px-4 py-2 bg-white/10 hover:bg-white/20 cursor-pointer text-sm rounded-lg">
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
        className="w-full p-4 bg-zinc-900 border border-white/10 rounded-lg outline-none focus:border-purple-500"
      />

      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Prix"
        type="number"
        className="w-full p-4 bg-zinc-900 border border-white/10 rounded-lg outline-none focus:border-purple-500"
      />

      <input
        name="body"
        value={form.body}
        onChange={handleChange}
        placeholder="Body"
        className="w-full p-4 bg-zinc-900 border border-white/10 rounded-lg outline-none focus:border-purple-500"
      />

      <input
        name="neck"
        value={form.neck}
        onChange={handleChange}
        placeholder="Neck"
        className="w-full p-4 bg-zinc-900 border border-white/10 rounded-lg outline-none focus:border-purple-500"
      />

      <input
        name="pickups"
        value={form.pickups}
        onChange={handleChange}
        placeholder="Pickups"
        className="w-full p-4 bg-zinc-900 border border-white/10 rounded-lg outline-none focus:border-purple-500"
      />

      <input
        name="hardware"
        value={form.hardware}
        onChange={handleChange}
        placeholder="Hardware"
        className="w-full p-4 bg-zinc-900 border border-white/10 rounded-lg outline-none focus:border-purple-500"
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">{success}</p>}

      <button
        type="submit"
        disabled={loading || uploading}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-colors text-sm tracking-widest uppercase rounded-lg"
      >
        {loading
          ? mode === "edit"
            ? "Modification..."
            : "Création..."
          : mode === "edit"
            ? "Enregistrer"
            : "Créer la guitare"}
      </button>
    </form>
  );
}
