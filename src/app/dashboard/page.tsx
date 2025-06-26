import { auth } from "~/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <p>This is your protected dashboard.</p>
    </div>
  );
}



