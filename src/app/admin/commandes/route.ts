import { redirect } from "next/navigation";

export async function GET() {
  // Block access to commandes - this route should not exist
  redirect("/admin");
}

export async function POST() {
  // Block access to commandes - this route should not exist
  redirect("/admin");
}
