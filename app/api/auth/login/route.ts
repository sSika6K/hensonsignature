import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, createAuthToken, verifyCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const username = String(body?.username ?? "").trim();
    const password = String(body?.password ?? "").trim();

    if (!username || !password) {
      return NextResponse.json(
        { status: "error", message: "Utilisateur et mot de passe requis" },
        { status: 400 },
      );
    }

    if (!verifyCredentials(username, password)) {
      return NextResponse.json(
        { status: "error", message: "Identifiants invalides" },
        { status: 401 },
      );
    }

    const token = createAuthToken();
    const response = NextResponse.json({
      status: "ok",
      message: "Connexion réussie",
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { status: "error", message: "Erreur lors de la connexion" },
      { status: 500 },
    );
  }
}
