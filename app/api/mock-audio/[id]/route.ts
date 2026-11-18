import { mockRepo } from "@/lib/practice/mock-repo";
import { isMock } from "@/lib/session";

/** MOCK_MODE only: plays back a recording held in the in-memory store. */
export async function GET(_req: Request, ctx: RouteContext<"/api/mock-audio/[id]">) {
  if (!isMock()) return new Response("Not found", { status: 404 });
  const { id } = await ctx.params;
  const clip = mockRepo.audio(id);
  if (!clip) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(clip.data), { headers: { "Content-Type": clip.mime, "Cache-Control": "private, max-age=3600" } });
}
