import { MOCK_ORDERS } from "@/lib/data";
import OrderDetailClient from "./OrderDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = MOCK_ORDERS.find((o) => o.id === id);

  if (!order) {
    notFound();
  }

  return <OrderDetailClient order={order} />;
}
