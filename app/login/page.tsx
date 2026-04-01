"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Connexion impossible");
      }

      router.push("/manage");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-xl p-8">
        <h1 className="text-4xl font-light mb-3">Connexion</h1>
        <p className="text-white/60 mb-8">
          Connecte-toi pour accéder à la gestion.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm text-white/70">Utilisateur</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Utilisateur"
              className="w-full p-4 bg-black border border-white/10 rounded-lg outline-none focus:border-purple-500"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white/70">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full p-4 bg-black border border-white/10 rounded-lg outline-none focus:border-purple-500"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-colors rounded-lg text-sm tracking-widest uppercase"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
