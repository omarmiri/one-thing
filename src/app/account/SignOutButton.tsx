"use client";

import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-sm underline"
      onClick={async () => {
        await fetch("/api/account/signout", { method: "POST" });
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
