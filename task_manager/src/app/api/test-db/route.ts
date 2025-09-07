import { authClient } from "@/lib/auth-client";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const result = await authClient.signIn.email({
    email,
    password,
  });

  if (!result.data) {
    return Response.json(
      { error: result.error?.message || "Invalid credentials" },
      { status: 401 }
    );
  }

  return Response.json({
    user: result.data.user,
    token: result.data?.token, // or .accessToken depending on config
  });
}
