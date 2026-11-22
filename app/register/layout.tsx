// app/register/layout.tsx  (ekdom same code, shudhu function-er nam RegisterLayout)
import { redirect } from "next/navigation";
import { getSession } from "@/lib/core/server";

export default async function RegisterLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (session?.user && !session.user.banned) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}