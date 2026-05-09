"use client";

import { useState, useTransition } from "react";
import { markTutorialSeen } from "./tutorial-action";
import {
  LayoutDashboard, Package, ShoppingBag, FileUp,
  History, MessageSquare, Trash2, ArrowRight, ArrowLeft,
  X, CheckCircle, Sparkles
} from "lucide-react";

interface Props {
  adminName: string;
}

const STEPS = [
  {
    icon: Sparkles,
    color: "text-gold",
    title: "Bienvenue dans l'Admin !",
    subtitle: "Guide rapide — 2 minutes",
    content: (name: string) => (
      <div className="space-y-4">
        <p className="text-slate-300 leading-relaxed">
          Salut <span className="text-gold font-semibold">{name}</span> 👋 Ce guide te présente chaque section du dashboard en quelques étapes. Tu ne peux pas le rater — il ne s'affiche qu'une seule fois.
        </p>
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: Package, label: "Parfums" },
            { icon: ShoppingBag, label: "Commandes" },
            { icon: MessageSquare, label: "Chat" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded border border-gold/10">
              <Icon className="w-5 h-5 text-gold/60" />
              <span className="text-[10px] text-slate-400 tracking-widest uppercase">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: LayoutDashboard,
    color: "text-blue-400",
    title: "Tableau de bord",
    subtitle: "/admin",
    content: () => (
      <div className="space-y-4">
        <p className="text-slate-300 leading-relaxed">
          La page d'accueil de l'admin te donne une vue d'ensemble de l'activité : nombre de parfums, commandes récentes, alertes importantes.
        </p>
        <div className="bg-slate-800/60 rounded border border-slate-700 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-slate-300 text-sm">Stats en temps réel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-slate-300 text-sm">Dernières commandes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gold/80" />
            <span className="text-slate-300 text-sm">Activité récente</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Package,
    color: "text-gold",
    title: "Gestion des Parfums",
    subtitle: "/admin/parfums",
    content: () => (
      <div className="space-y-4">
        <p className="text-slate-300 leading-relaxed">
          Ajoute, modifie ou supprime des parfums depuis cette section.
        </p>
        <div className="space-y-3">
          <div className="flex gap-3 items-start p-3 bg-slate-800/50 rounded border border-slate-700">
            <span className="text-gold text-lg">+</span>
            <div>
              <p className="text-white text-sm font-medium">Nouveau parfum</p>
              <p className="text-slate-400 text-xs">Bouton en haut à droite — remplit le formulaire complet (notes, saison, occasion…)</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-3 bg-slate-800/50 rounded border border-slate-700">
            <span className="text-blue-400 text-lg">✎</span>
            <div>
              <p className="text-white text-sm font-medium">Modifier</p>
              <p className="text-slate-400 text-xs">Clique sur le nom d'un parfum pour l'éditer</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-3 bg-slate-800/50 rounded border border-red-500/10">
            <span className="text-red-400 text-lg">🗑</span>
            <div>
              <p className="text-white text-sm font-medium">Supprimer</p>
              <p className="text-slate-400 text-xs">Envoie dans la <strong className="text-slate-300">corbeille</strong> (récupérable 30 jours, pas de panique)</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: ShoppingBag,
    color: "text-emerald-400",
    title: "Commandes",
    subtitle: "/admin/commandes",
    content: () => (
      <div className="space-y-4">
        <p className="text-slate-300 leading-relaxed">
          Les commandes passées par les clients apparaissent ici. Tu peux voir le détail et faire avancer le statut.
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {["En attente", "Confirmée", "Expédiée", "Livrée"].map((s, i, arr) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] px-3 py-1.5 rounded-sm border tracking-wider uppercase ${
                i === 0 ? "border-yellow-500/40 text-yellow-400 bg-yellow-500/10" :
                i === 1 ? "border-blue-500/40 text-blue-400 bg-blue-500/10" :
                i === 2 ? "border-purple-500/40 text-purple-400 bg-purple-500/10" :
                "border-green-500/40 text-green-400 bg-green-500/10"
              }`}>{s}</span>
              {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />}
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-xs">Clique sur une commande → boutons de changement de statut à droite</p>
      </div>
    ),
  },
  {
    icon: FileUp,
    color: "text-purple-400",
    title: "Import CSV en masse",
    subtitle: "/admin/import",
    content: () => (
      <div className="space-y-4">
        <p className="text-slate-300 leading-relaxed">
          Pour ajouter beaucoup de parfums d'un coup, utilise l'import CSV. Plus rapide que de tout rentrer à la main.
        </p>
        <div className="bg-slate-800/60 rounded border border-slate-700 p-4 font-mono text-xs text-slate-400 overflow-x-auto">
          <p className="text-slate-500 mb-1">Format attendu :</p>
          <p>name, brand, price, gender, description, ...</p>
        </div>
        <div className="flex items-start gap-2 text-xs text-amber-400/80 bg-amber-500/5 border border-amber-500/15 rounded p-3">
          <span>⚠️</span>
          <p>Le fichier est validé ligne par ligne avant import. Les erreurs sont signalées sans rien casser.</p>
        </div>
      </div>
    ),
  },
  {
    icon: History,
    color: "text-slate-400",
    title: "Logs & Chat",
    subtitle: "/admin/logs · /admin/chat",
    content: () => (
      <div className="space-y-4">
        <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <History className="w-4 h-4 text-slate-400" />
            <span className="text-white text-sm font-medium">Logs d'activité</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Chaque action (ajout, modif, suppression, import…) est enregistrée avec le nom de l'admin, la date et le résultat. Idéal pour comprendre ce qui s'est passé.
          </p>
        </div>
        <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-medium">Chat interne</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Un chat en temps réel entre toi et l'autre admin. Pour vous laisser des notes, coordonner les mises à jour, etc. Les messages sont conservés.
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: Trash2,
    color: "text-red-400",
    title: "La Corbeille",
    subtitle: "/admin/trash",
    content: () => (
      <div className="space-y-4">
        <p className="text-slate-300 leading-relaxed">
          Rien n'est vraiment supprimé immédiatement. Les parfums et commandes supprimés atterrissent ici pendant <strong className="text-white">30 jours</strong>.
        </p>
        <div className="space-y-3">
          <div className="flex gap-3 items-center p-3 bg-slate-800/50 rounded border border-slate-700">
            <span className="text-green-400">↺</span>
            <p className="text-slate-300 text-sm"><strong className="text-white">Restaurer</strong> — remet l'élément en place</p>
          </div>
          <div className="flex gap-3 items-center p-3 bg-slate-800/50 rounded border border-red-500/10">
            <span className="text-red-400">✕</span>
            <p className="text-slate-300 text-sm"><strong className="text-white">Vider</strong> — suppression définitive et irréversible</p>
          </div>
        </div>
        <p className="text-slate-500 text-xs">💡 Si tu supprimes un parfum par erreur, va dans la corbeille et clique restaurer.</p>
      </div>
    ),
  },
  {
    icon: CheckCircle,
    color: "text-gold",
    title: "C'est bon, tu es prêt !",
    subtitle: "Fin du guide",
    content: (name: string) => (
      <div className="space-y-4">
        <p className="text-slate-300 leading-relaxed">
          Tu connais maintenant l'essentiel du dashboard, <span className="text-gold font-semibold">{name}</span>. N'hésite pas à explorer chaque section — rien n'est irréversible sans confirmation.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Package, label: "Parfums", href: "/admin/parfums" },
            { icon: ShoppingBag, label: "Commandes", href: "/admin/commandes" },
            { icon: MessageSquare, label: "Chat", href: "/admin/chat" },
            { icon: History, label: "Logs", href: "/admin/logs" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 p-3 bg-slate-800/50 rounded border border-gold/10">
              <Icon className="w-4 h-4 text-gold/60" />
              <span className="text-slate-300 text-sm">{label}</span>
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-xs text-center pt-2">
          Une question ? Utilise le 💬 Chat pour contacter l'autre admin.
        </p>
      </div>
    ),
  },
];

export default function AdminTutorial({ adminName }: Props) {
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  const close = () => {
    setClosing(true);
    startTransition(async () => {
      await markTutorialSeen();
    });
  };

  if (closing) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-gold/20 rounded-sm shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.35em] uppercase text-slate-500">Guide Admin</span>
            <span className="text-slate-700">·</span>
            <span className="text-[10px] text-gold/60">{step + 1}/{STEPS.length}</span>
          </div>
          <button
            onClick={close}
            disabled={isPending}
            className="p-1.5 text-slate-600 hover:text-slate-300 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-px bg-slate-800">
          <div
            className="h-full bg-gold transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 min-h-[320px] flex flex-col">
          <div className="flex items-start gap-4 mb-6">
            <div className={`mt-0.5 ${current.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white text-xl font-serif mb-0.5">{current.title}</h2>
              <p className="text-slate-600 text-[10px] tracking-widest font-mono uppercase">{current.subtitle}</p>
            </div>
          </div>
          <div className="flex-1">
            {current.content(adminName)}
          </div>
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/50">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Précédent
          </button>

          {/* Step dots */}
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === step ? "w-4 h-1.5 bg-gold" : i < step ? "w-1.5 h-1.5 bg-gold/40" : "w-1.5 h-1.5 bg-slate-700"
                }`}
              />
            ))}
          </div>

          {isLast ? (
            <button
              onClick={close}
              disabled={isPending}
              className="flex items-center gap-2 bg-gold text-luxury-black text-xs font-semibold tracking-widest uppercase px-5 py-2 hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Terminé
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm"
            >
              Suivant
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
