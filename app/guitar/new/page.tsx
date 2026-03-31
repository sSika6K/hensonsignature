"use client";



const isValidImageUrl = (value: string) => {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

const normalizeYouTubeVideoId = (value: string) => {
  const trimmed = value.trim()

  if (!trimmed) return ''

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  try {
    const url = new URL(trimmed)

    if (url.hostname.includes('youtu.be')) {
      return url.pathname.replace('/', '').slice(0, 11)
    }

    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v')
      if (v) return v.slice(0, 11)

      const parts = url.pathname.split('/')
      const shortId = parts[parts.length - 1]
      if (shortId) return shortId.slice(0, 11)
    }
  } catch {
    return ''
  }

  return ''
}

export default function NewGuitarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: "",
    type: "electric",
    year: "",
    description: "",
    imageUrl: "",
    videoId: "",
    price: "",
    body: "",
    neck: "",
    pickups: "",
    hardware: "",
  });

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const normalizedVideoId = normalizeYouTubeVideoId(form.videoId)
    const normalizedImageUrl = form.imageUrl.trim()

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
      setError('Merci de remplir tous les champs')
      setLoading(false)
      return
    }

    if (!isValidImageUrl(normalizedImageUrl)) {
      setError("L'URL de l'image n'est pas valide")
      setLoading(false)
      return
    }

    if (!normalizedVideoId) {
      setError("Le lien ou l'identifiant YouTube n'est pas valide")
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/guitars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          imageUrl: normalizedImageUrl,
          videoId: normalizedVideoId,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création')
      }

      router.push('/manage')
      router.refresh()
    } catch (err) {
      setError("Impossible d'ajouter la guitare")
    } finally {
      setLoading(false)
    }
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
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Image URL (https://...)"
            className="w-full p-4 bg-zinc-900 border border-white/10"
          />
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
            {loading ? 'Création...' : 'Créer la guitare'}
          </button>
        </form>
      </div>
    </div>
  );
}
