import GuitarForm from "./GuitarForm";

export default function NewGuitarPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-light mb-8">Ajouter une guitare</h1>
        <GuitarForm mode="create" />
      </div>
    </div>
  );
}
