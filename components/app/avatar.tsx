import Image from "next/image";
import type { User } from "@/lib/types";

/** Preset avatar (1-8) or uploaded photo, as a circle. */
export function Avatar({ user, size, className }: { user: Pick<User, "avatarId" | "pictureUrl" | "name">; size: number; className?: string }) {
  if (user.pictureUrl?.startsWith("data:") || (!user.avatarId && user.pictureUrl)) {
    // eslint-disable-next-line @next/next/no-img-element -- data URLs / Google photos
    return <img src={user.pictureUrl!} alt="" width={size} height={size} className={`shrink-0 rounded-full object-cover ${className ?? ""}`} style={{ width: size, height: size }} />;
  }
  if (user.avatarId) {
    return <Image src={`/avatars/${user.avatarId}.png`} alt="" width={size} height={size} className={`shrink-0 rounded-full ${className ?? ""}`} />;
  }
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-tint font-bold text-moss ${className ?? ""}`} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {(user.name ?? "?").slice(0, 1).toUpperCase()}
    </span>
  );
}
