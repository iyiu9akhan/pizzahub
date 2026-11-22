// app/login/layout.tsx
import { getSession } from "@/lib/core/server";
import { redirect } from "next/navigation";

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (session?.user && !session.user.banned) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}