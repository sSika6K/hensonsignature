import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizeYouTubeId(input: string) {
  const value = input.trim();

  if (!value) return "";

  const watchMatch = value.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch?.[1]) return watchMatch[1];

  const shortMatch = value.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch?.[1]) return shortMatch[1];

  const embedMatch = value.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch?.[1]) return embedMatch[1];

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  return "";
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateGuitarPayload(body: any) {
  const requiredTextFields = [
    "name",
    "type",
    "description",
    "imageUrl",
    "videoId",
    "body",
    "neck",
    "pickups",
    "hardware",
  ];

  for (const field of requiredTextFields) {
    if (typeof body?.[field] !== "string" || body[field].trim() === "") {
      return `Le champ "${field}" est obligatoire`;
    }
  }

  const year = Number(body.year);
  const price = Number(body.price);

  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return "L’année doit être un nombre valide";
  }

  if (!Number.isFinite(price) || price < 0) {
    return "Le prix doit être un nombre positif";
  }

  if (
    !isValidHttpUrl(body.imageUrl.trim()) &&
    !body.imageUrl.trim().startsWith("/")
  ) {
    return "L'URL de l'image doit être valide";
  }

  const normalizedVideoId = normalizeYouTubeId(body.videoId);
  if (!normalizedVideoId) {
    return "La vidéo doit être un lien ou un ID YouTube valide";
  }

  return null;
}

export async function GET() {
  try {
    const guitars = await prisma.guitar.findMany({
      orderBy: { year: "desc" },
    });

    return NextResponse.json(guitars);
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Impossible de récupérer les guitares",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationError = validateGuitarPayload(body);

    if (validationError) {
      return NextResponse.json(
        {
          status: "error",
          message: validationError,
        },
        { status: 400 },
      );
    }

    const guitar = await prisma.guitar.create({
      data: {
        name: body.name.trim(),
        type: body.type.trim(),
        year: Number(body.year),
        description: body.description.trim(),
        imageUrl: body.imageUrl.trim(),
        videoId: normalizeYouTubeId(body.videoId),
        price: Number(body.price),
        body: body.body.trim(),
        neck: body.neck.trim(),
        pickups: body.pickups.trim(),
        hardware: body.hardware.trim(),
      },
    });

    return NextResponse.json(guitar, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Impossible de créer la guitare",
      },
      { status: 500 },
    );
  }
}
