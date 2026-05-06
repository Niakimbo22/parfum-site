import { requireAdmin } from "@/lib/auth";
import { fetchInitialMessages } from "./actions";
import ChatClient from "./ChatClient";

export const dynamic = "force-dynamic";

export default async function AdminChatPage() {
  const session = await requireAdmin();
  const initial = await fetchInitialMessages();

  return (
    <ChatClient
      currentAdminName={session.adminName}
      initialMessages={initial.map((m) => ({
        id: m.id as string,
        senderName: m.sender_name as string,
        content: m.content as string,
        createdAt: m.created_at as string,
      }))}
    />
  );
}
