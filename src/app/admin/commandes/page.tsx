import { redirect } from "next/navigation";

export default function CommandesPage() {
  // Block commandes page
  redirect("/admin");
}
