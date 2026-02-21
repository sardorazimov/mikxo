import { cookies } from "next/headers";
import AdminLogin from "./login-form";
import AdminDashboard from "./dashboard";

export default async function AdminPage() {
  const adminSession = (await cookies()).get("admin_session")?.value;

  if (adminSession !== "valid") {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
