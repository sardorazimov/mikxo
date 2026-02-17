import { google } from "@/lib/oauth";
import { cookies } from "next/headers";

export async function GET() {

  const state = crypto.randomUUID();

  // PKCE code verifier oluştur
  const codeVerifier = crypto.randomUUID();

  // cookie'ye kaydet
  (await
    // cookie'ye kaydet
    cookies()).set("oauth_state", state);
  (await cookies()).set("oauth_code_verifier", codeVerifier);

  const url = google.createAuthorizationURL(
    state,
    codeVerifier,
    [
      "openid",
      "profile",
      "email"
    ]
  );

  return Response.redirect(url);

}
