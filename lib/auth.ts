export const AUTH_COOKIE_NAME = "henson_auth_session";
export const AUTH_USER = "Armand";
export const AUTH_PASSWORD = "jaimetroparmand";

type AuthSessionPayload = {
  user: string;
  password: string;
  issuedAt: number;
};

export function createAuthToken(): string {
  const payload: AuthSessionPayload = {
    user: AUTH_USER,
    password: AUTH_PASSWORD,
    issuedAt: Date.now(),
  };

  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function verifyCredentials(username: string, password: string): boolean {
  return username === AUTH_USER && password === AUTH_PASSWORD;
}

export function isValidAuthToken(token: string | undefined | null): boolean {
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded) as Partial<AuthSessionPayload>;

    return (
      parsed.user === AUTH_USER &&
      parsed.password === AUTH_PASSWORD &&
      typeof parsed.issuedAt === "number"
    );
  } catch {
    return false;
  }
}
