import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const guitar = await prisma.guitar.findUnique({
      where: { id: Number(id) },
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
    const body = await request.json();

    const updatedGuitar = await prisma.guitar.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        type: body.type,
        year: Number(body.year),
        description: body.description,
        imageUrl: body.imageUrl,
        videoId: body.videoId,
        price: Number(body.price),
        body: body.body,
        neck: body.neck,
        pickups: body.pickups,
        hardware: body.hardware,
      },
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

    await prisma.guitar.delete({
      where: { id: Number(id) },
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
