import type { Metadata } from "next";
import { Suspense } from "react";
import { TopBar } from "@/components/app/shell";
import { getMe } from "@/lib/api";
import { practice } from "@/lib/practice/repo";
import { isMock } from "@/lib/session";
import { ProfileView } from "./profile-view";

export const metadata: Metadata = { title: "Profile" };

async function Profile() {
  const [{ user }, stats] = await Promise.all([getMe(), (await practice()).stats()]);
  return <ProfileView user={user} stats={stats} canUploadPhoto={isMock()} />;
}

export default function ProfilePage() {
  return (
    <>
      <div className="lg:hidden">
        <TopBar title="Profile" />
      </div>
      <main className="min-h-0 flex-1 overflow-y-auto">
        <Suspense>
          <Profile />
        </Suspense>
      </main>
    </>
  );
}
