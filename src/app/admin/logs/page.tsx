import { requireAdmin } from "@/lib/auth";
import { fetchAuditLogs } from "./actions";
import LogsClient from "./LogsClient";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  await requireAdmin();
  const logs = await fetchAuditLogs();
  return <LogsClient initialLogs={logs} />;
}
