import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RegisterView } from "@/components/auth/RegisterView";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect(process.env.ADMIN_HOST_MODE === "true" ? "/admin/blog" : "/profile");
  }

  return <RegisterView />;
}
