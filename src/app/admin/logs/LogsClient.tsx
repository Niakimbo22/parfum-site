"use client";

import { History, Search, Filter, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { useState, useTransition } from "react";
import { archiveAuditLogs, type AuditRow } from "./actions";

interface Props {
  initialLogs: AuditRow[];
}

export default function LogsClient({ initialLogs }: Props) {
  const [logs, setLogs] = useState<AuditRow[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleArchiveClick = () => {
    setConfirming(true);
    setPassword("");
    setError("");
  };

  const handleConfirm = () => {
    if (!password) { setError("Entrez votre mot de passe."); return; }
    setError("");
    startTransition(async () => {
      const res = await archiveAuditLogs(password);
      if (res?.error) {
        setError(res.error);
      } else {
        // Keep permanent entries in the UI, clear the rest
        setLogs(prev => prev.filter(l => l.permanent));
        setConfirming(false);
        setPassword("");
        // Reload to get the new permanent entry from server
        window.location.reload();
      }
    });
  };

  const filtered = logs.filter((log) => {
    const q = searchTerm.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      (log.details ?? "").toLowerCase().includes(q) ||
      log.actor.toLowerCase().includes(q)
    );
  });

  const getActorColor = (actor: string) => {
    switch (actor) {
      case "Luca": return "text-green-400 bg-green-500/10 border border-green-500/20";
      case "Nico": return "text-blue-400 bg-blue-500/10 border border-blue-500/20";
      case "System": return "text-gold bg-gold/10 border border-gold/20";
      default: return "text-gray-400 bg-gray-500/10 border border-gray-500/20";
    }
  };

  const getStatusColor = (status: AuditRow["status"]) => {
    switch (status) {
      case "success": return "bg-green-500/10 text-green-500";
      case "warning": return "bg-yellow-500/10 text-yellow-500";
      case "error": return "bg-red-500/10 text-red-500";
      default: return "bg-blue-500/10 text-blue-500";
    }
  };

  return (
    <div className="text-slate-200">
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-serif text-white">Logs d'activité</h1>
          <p className="text-gray-400">Historique complet des actions effectuées sur le panneau d'administration.</p>
        </div>
        <div className="flex gap-2">
          {!confirming ? (
            <button
              onClick={handleArchiveClick}
              className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-medium uppercase tracking-widest transition-colors bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
            >
              <History className="w-3 h-3" />
              Réinitialiser les logs
            </button>
          ) : null}
          <button className="flex items-center gap-2 px-4 py-2 border border-gold/10 rounded-sm text-xs hover:bg-gold/5 transition-colors">
            <Filter className="w-3 h-3 text-gold" /> Filtrer
          </button>
        </div>
      </div>

      {/* Password confirmation modal */}
      {confirming && (
        <div className="mb-6 p-6 bg-red-500/5 border border-red-500/30 rounded-sm">
          <p className="text-red-300 text-sm font-medium mb-1">⚠️ Réinitialisation des logs</p>
          <p className="text-gray-400 text-xs mb-4">
            Les logs seront archivés. Une entrée <span className="text-yellow-400 font-bold">permanente</span> sera conservée à vie dans les logs actifs.
            <br />Confirmez avec votre mot de passe :
          </p>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleConfirm()}
                placeholder="Votre mot de passe"
                autoFocus
                className="bg-slate-900 border border-red-500/30 text-white px-4 py-2 pr-10 rounded-sm text-sm focus:outline-none focus:border-red-400 w-56"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={handleConfirm}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/30 text-red-300 border border-red-500/40 hover:bg-red-500/40 rounded-sm text-xs font-medium uppercase tracking-widest disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <History className="w-3 h-3" />}
              {isPending ? "Archivage..." : "Confirmer"}
            </button>
            <button
              onClick={() => { setConfirming(false); setPassword(""); setError(""); }}
              disabled={isPending}
              className="px-4 py-2 border border-gold/10 rounded-sm text-xs hover:bg-gold/5 transition-colors"
            >
              Annuler
            </button>
          </div>
          {error && (
            <p className="mt-3 text-red-400 text-xs">{error}</p>
          )}
        </div>
      )}

      <div className="bg-luxury-black border border-gold/10 rounded-sm overflow-hidden">
        <div className="p-4 border-b border-gold/10 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher une action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-luxury-slate/20 border border-gold/10 text-white pl-10 pr-4 py-2 rounded-sm text-sm focus:outline-none focus:border-gold/50"
            />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gold/10 text-[10px] uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4 font-bold">Acteur</th>
                <th className="px-6 py-4 font-bold">Action</th>
                <th className="px-6 py-4 font-bold">Détails</th>
                <th className="px-6 py-4 font-bold">Heure</th>
                <th className="px-6 py-4 font-bold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {filtered.map((log) => (
                <tr
                  key={log.id}
                  className={`text-sm hover:bg-white/5 transition-colors ${log.permanent ? "bg-yellow-500/5 border-l-2 border-l-yellow-500/40" : ""}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getActorColor(log.actor)}`}>
                        {log.actor === "System" ? "S" : log.actor[0]}
                      </span>
                      <span className={`font-medium ${getActorColor(log.actor)}`}>{log.actor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    <div className="flex items-center gap-2">
                      {log.permanent && <div title="Entrée permanente"><Lock className="w-3 h-3 text-yellow-500 shrink-0" /></div>}
                      {log.action}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{log.details ?? "-"}</td>
                  <td className="px-6 py-4 text-gray-500 italic">
                    {new Date(log.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                      {log.permanent && (
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-yellow-500/10 text-yellow-500">
                          permanent
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-20 border-t border-gold/10">
              <p className="text-gray-500 italic">Aucune entrée de log pour le moment.</p>
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 italic">Aucune entrée de log pour le moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-gold/5">
              {filtered.map((log) => (
                <div
                  key={log.id}
                  className={`p-4 ${log.permanent ? "bg-yellow-500/5 border-l-2 border-l-yellow-500/40" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getActorColor(log.actor)}`}>
                        {log.actor === "System" ? "S" : log.actor[0]}
                      </span>
                      <span className={`font-medium text-sm ${getActorColor(log.actor)}`}>{log.actor}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                      {log.permanent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-yellow-500/10 text-yellow-500">
                          perm.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {log.permanent && <Lock className="w-3 h-3 text-yellow-500 shrink-0" />}
                    <p className="text-white text-sm font-medium">{log.action}</p>
                  </div>
                  {log.details && (
                    <p className="text-gray-500 font-mono text-xs mb-1 truncate">{log.details}</p>
                  )}
                  <p className="text-gray-600 text-xs italic">{new Date(log.created_at).toLocaleString("fr-FR")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
