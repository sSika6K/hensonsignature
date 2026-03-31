import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

type GuitarPayload = {
  name?: string;
  type?: string;
  year?: string | number;
  description?: string;
  imageUrl?: string;
  videoId?: string;
  price?: string | number;
  body?: string;
  neck?: string;
  pickups?: string;
  hardware?: string;
};

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function parseId(id: string) {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function validatePayload(body: GuitarPayload) {
  const requiredFields = [
    "name",
    "type",
    "year",
    "description",
    "imageUrl",
    "videoId",
    "price",
    "body",
    "neck",
    "pickups",
    "hardware",
  ] as const;

  const missingFields = requiredFields.filter((field) => {
    const value = body[field];
    return (
      typeof value === "undefined" ||
      value === null ||
      String(value).trim() === ""
    );
  });

  if (missingFields.length > 0) {
    return {
      ok: false,
      message: `Champs obligatoires manquants : ${missingFields.join(", ")}`,
    } as const;
  }

  const year = Number(body.year);
  const price = Number(body.price);

  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return {
      ok: false,
      message: "L'année doit être un nombre valide entre 1900 et 2100",
    } as const;
  }

  if (!Number.isFinite(price) || price < 0) {
    return {
      ok: false,
      message: "Le prix doit être un nombre valide",
    } as const;
  }

  if (!isNonEmptyString(body.imageUrl)) {
    return {
      ok: false,
      message: "L'URL de l'image est invalide",
    } as const;
  }

  if (
    !isNonEmptyString(body.videoId) &&
    !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(
      String(body.videoId ?? ""),
    )
  ) {
    return {
      ok: false,
      message:
        "La vidéo doit être un lien YouTube ou un identifiant vidéo valide",
    } as const;
  }

  return {
    ok: true,
    data: {
      name: String(body.name).trim(),
      type: String(body.type).trim(),
      year,
      description: String(body.description).trim(),
      imageUrl: String(body.imageUrl).trim(),
      videoId: String(body.videoId).trim(),
      price,
      body: String(body.body).trim(),
      neck: String(body.neck).trim(),
      pickups: String(body.pickups).trim(),
      hardware: String(body.hardware).trim(),
    },
  } as const;
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const guitarId = parseId(id);

    if (!guitarId) {
      return NextResponse.json(
        { status: "error", message: "Identifiant invalide" },
        { status: 400 },
      );
    }

    const guitar = await prisma.guitar.findUnique({
      where: { id: guitarId },
    });

    if (!guitar) {
      return NextResponse.json(
        { status: "error", message: "Guitare introuvable" },
        { status: 404 },
      );
    }

    return NextResponse.json(guitar);
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Erreur lors de la récupération" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const guitarId = parseId(id);

    if (!guitarId) {
      return NextResponse.json(
        { status: "error", message: "Identifiant invalide" },
        { status: 400 },
      );
    }

    const body = (await request.json()) as GuitarPayload;
    const validation = validatePayload(body);

    if (!validation.ok) {
      return NextResponse.json(
        { status: "error", message: validation.message },
        { status: 400 },
      );
    }

    const data = validation.data;

    const updatedGuitar = await prisma.guitar.update({
      where: { id: guitarId },
      data,
    });

    return NextResponse.json(updatedGuitar);
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Impossible de modifier la guitare" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const guitarId = parseId(id);

    if (!guitarId) {
      return NextResponse.json(
        { status: "error", message: "Identifiant invalide" },
        { status: 400 },
      );
    }

    await prisma.guitar.delete({
      where: { id: guitarId },
    });

    return NextResponse.json({
      status: "ok",
      message: "Guitare supprimée",
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Impossible de supprimer la guitare" },
      { status: 500 },
    );
  }
}
