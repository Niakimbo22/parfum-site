"use client";

import { useState, useTransition } from "react";
import { Upload, FileJson, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { importPerfumes } from "./actions";

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_ROWS = 500;

type Row = Record<string, unknown>;

function parseCsv(text: string): Row[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((h) => h.trim());
  const rows: Row[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]);
    const obj: Row = {};
    headers.forEach((h, idx) => {
      const v = values[idx]?.trim() ?? "";
      if (h === "top_notes" || h === "heart_notes" || h === "base_notes") {
        obj[h] = v
          ? v.split(";").map((s) => s.trim()).filter(Boolean)
          : [];
      } else if (h === "price" || h === "stock") {
        obj[h] = v === "" ? undefined : Number(v);
      } else {
        obj[h] = v === "" ? null : v;
      }
    });
    rows.push(obj);
  }
  return rows;
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

export default function BulkImportPage() {
  const [data, setData] = useState<Row[]>([]);
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [status, setStatus] = useState<{ success?: string; error?: string; issues?: { path: string; message: string }[] }>({});
  const [isPending, startTransition] = useTransition();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setStatus({ error: `Fichier trop volumineux (max ${MAX_FILE_BYTES / 1024 / 1024} Mo).` });
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let rows: Row[];
        if (format === "json") {
          const parsed = JSON.parse(text);
          rows = Array.isArray(parsed) ? parsed : [parsed];
        } else {
          rows = parseCsv(text);
        }
        if (rows.length === 0) {
          setStatus({ error: "Aucune ligne valide détectée." });
          return;
        }
        if (rows.length > MAX_ROWS) {
          setStatus({ error: `Trop de lignes (max ${MAX_ROWS}).` });
          return;
        }
        setData(rows);
        setStatus({});
      } catch {
        setStatus({ error: "Erreur lors de la lecture du fichier. Vérifiez le format." });
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    setStatus({});
    startTransition(async () => {
      const res = await importPerfumes(data);
      if (res?.error) {
        setStatus({ error: res.error, issues: res.issues });
      } else if (res?.success) {
        setStatus({ success: `${res.count} parfums importés avec succès !` });
        setData([]);
      }
    });
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-white">Import en masse</h1>
        <p className="text-gray-400">Ajoutez rapidement plusieurs parfums via un fichier JSON ou CSV.</p>
      </div>

      <div className="bg-luxury-black border border-gold/10 p-8 rounded-sm mb-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFormat("json")}
            className={`flex-1 flex items-center justify-center gap-2 p-4 border rounded-sm transition-all ${format === "json" ? "border-gold bg-gold/5 text-gold" : "border-gold/10 text-gray-500 hover:border-gold/30"}`}
          >
            <FileJson className="w-5 h-5" />
            Format JSON
          </button>
          <button
            onClick={() => setFormat("csv")}
            className={`flex-1 flex items-center justify-center gap-2 p-4 border rounded-sm transition-all ${format === "csv" ? "border-gold bg-gold/5 text-gold" : "border-gold/10 text-gray-500 hover:border-gold/30"}`}
          >
            <FileSpreadsheet className="w-5 h-5" />
            Format CSV
          </button>
        </div>

        <div className="border-2 border-dashed border-gold/10 rounded-sm p-12 text-center hover:border-gold/30 transition-all">
          <input
            type="file"
            accept={format === "json" ? ".json,application/json" : ".csv,text/csv"}
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 text-gold/30 mx-auto mb-4" />
            <p className="text-white font-medium">Cliquez pour sélectionner un fichier {format.toUpperCase()}</p>
            <p className="text-gray-500 text-sm mt-2">Taille max : 2 Mo · {MAX_ROWS} lignes max</p>
          </label>
        </div>

        {data.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gold text-sm font-medium">{data.length} parfums prêts à être importés</p>
              <button
                onClick={handleImport}
                disabled={isPending}
                className="gold-button flex items-center gap-2"
              >
                {isPending ? "Importation..." : "Lancer l'importation"}
              </button>
            </div>
            <div className="max-h-60 overflow-auto border border-gold/10 rounded-sm bg-luxury-slate/50">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-luxury-black text-gold border-b border-gold/10">
                  <tr>
                    <th className="p-3">Nom</th>
                    <th className="p-3">Famille</th>
                    <th className="p-3">Prix</th>
                    <th className="p-3">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5">
                  {data.slice(0, 10).map((item, i) => (
                    <tr key={i} className="text-gray-400">
                      <td className="p-3">{String(item.name ?? "")}</td>
                      <td className="p-3">{String(item.olfactory_family ?? "-")}</td>
                      <td className="p-3">{String(item.price ?? "")} €</td>
                      <td className="p-3">{String(item.stock ?? "")}</td>
                    </tr>
                  ))}
                  {data.length > 10 && (
                    <tr>
                      <td colSpan={4} className="p-3 text-center text-gray-600">
                        ... et {data.length - 10} autres lignes
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {status.success && (
          <div className="mt-6 flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-sm">
            <CheckCircle2 className="w-5 h-5" />
            <p>{status.success}</p>
          </div>
        )}

        {status.error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p>{status.error}</p>
            </div>
            {status.issues && status.issues.length > 0 && (
              <ul className="mt-3 text-xs text-red-400 space-y-1 list-disc list-inside">
                {status.issues.map((iss, i) => (
                  <li key={i}>
                    <span className="font-mono">{iss.path}</span> — {iss.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-luxury-black border border-gold/10 rounded-sm">
          <h3 className="text-white font-medium mb-2">Exemple JSON</h3>
          <pre className="text-[10px] text-gray-500 bg-slate-900/50 p-4 rounded-sm overflow-auto">
{`[
  {
    "name": "Bois d'Argent",
    "olfactory_family": "Boisé",
    "price": 250.00,
    "stock": 10,
    "top_notes": ["Iris"],
    "heart_notes": ["Myrrhe"],
    "base_notes": ["Musc"]
  }
]`}
          </pre>
        </div>
        <div className="p-6 bg-luxury-black border border-gold/10 rounded-sm">
          <h3 className="text-white font-medium mb-2">Exemple CSV</h3>
          <pre className="text-[10px] text-gray-500 bg-slate-900/50 p-4 rounded-sm overflow-auto">
{`name,olfactory_family,price,stock,top_notes
"Bois d'Argent",Boisé,250.00,10,Iris;Bergamote
"Soleil Blanc",Ambré Floral,280.00,5,Pistache`}
          </pre>
        </div>
      </div>
    </div>
  );
}
