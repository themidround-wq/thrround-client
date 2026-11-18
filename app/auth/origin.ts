import type { NextRequest } from "next/server";

/** Public origin of this app; APP_URL wins so redirect URIs match Google's allow-list behind proxies. */
export function appOrigin(request: NextRequest) {
  const configured = process.env.APP_URL;
  return configured ? new URL(configured).origin : request.nextUrl.origin;
}
