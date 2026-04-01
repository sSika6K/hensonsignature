import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import ManageActions from "@/app/manage/ManageActions";
import { AUTH_COOKIE_NAME, isValidAuthToken } from "@/lib/auth";

export default async function ManagePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!isValidAuthToken(session)) {
    redirect("/login");
  }

  const guitars = await prisma.guitar.findMany({
    orderBy: { year: "desc" },
  });

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extralight mb-3">
              Gestion des guitares
            </h1>
            <p className="text-white/60">
              Créer, modifier et supprimer les guitares de la collection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors text-sm tracking-widest uppercase"
            >
              ← Retour à la collection
            </Link>

            <Link
              href="/guitar/new"
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-500 transition-colors text-sm tracking-widest uppercase"
            >
              + Ajouter une guitare
            </Link>
          </div>
        </div>

        <ManageActions guitars={guitars} />
      </div>
    </div>
  );
}
