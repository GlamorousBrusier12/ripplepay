"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
export default function Home(): JSX.Element {
  const session = useSession();

  return (
    <div className="text-2xl">
      <Appbar onSignin={signIn} onSignout={signOut} user={session.data?.user} />
    </div>
  );
}
