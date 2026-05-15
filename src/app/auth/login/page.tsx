import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginView } from "@/components/auth/LoginView";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect(process.env.ADMIN_HOST_MODE === "true" ? "/admin/blog" : "/profile");
  }

  return <LoginView />;
}
