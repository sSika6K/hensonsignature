import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.guitar.count();

    return NextResponse.json({
      status: "ok",
      message: "Connexion à la base de données réussie",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Impossible de contacter la base de données",
      },
      { status: 500 },
    );
  }
}
