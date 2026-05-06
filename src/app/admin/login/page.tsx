"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";
import { UserCircle2, Loader2, Globe, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await loginAction(password);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">
      {/* Soft background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="z-10 w-full max-w-[420px]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/5 border border-gold/10 mb-6">
            <UserCircle2 className="w-10 h-10 text-gold/80" />
          </div>
          <h1 className="text-3xl font-serif text-white mb-3">Espace Collaborateurs</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Cet espace est réservé au personnel de la <br /> 
            <span className="text-gold uppercase tracking-widest text-xs font-bold">Parfumerie Les 2 As</span>
          </p>
        </div>

        <div className="bg-luxury-black border border-gold/10 p-10 rounded-sm shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] uppercase tracking-widest text-gold font-medium">
                Code d'accès sécurisé
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-gold/10 text-white px-5 py-4 pr-14 rounded-sm focus:outline-none focus:border-gold/40 transition-all placeholder:text-gray-700"
                  placeholder="Entrez votre code"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 italic">
                Veuillez saisir votre identifiant personnel pour accéder à la gestion.
              </p>
            </div>

            {error && (
              <div className="text-red-400 text-xs py-2 border-b border-red-400/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-button flex items-center justify-center gap-3 py-4 group disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Accéder au tableau de bord
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold transition-colors text-xs uppercase tracking-widest">
            <Globe className="w-3 h-3" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
