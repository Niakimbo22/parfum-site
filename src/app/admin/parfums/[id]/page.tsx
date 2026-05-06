import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import EditPerfumeClient from "./EditPerfumeClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPerfumePage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const { data: perfume, error } = await supabaseAdmin()
    .from("perfumes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !perfume) {
    notFound();
  }

  return <EditPerfumeClient perfume={perfume} />;
}
