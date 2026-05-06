import { notFound } from "next/navigation";

export default function CommmandesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This section should not exist - redirect to 404
  notFound();
}
