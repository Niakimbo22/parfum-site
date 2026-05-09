"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  LogOut,
  FileUp,
  History,
  MessageSquare,
  Globe,
  Trash2,
  ShoppingBag,
  Menu,
  X,
  BookOpen,
} from "lucide-react";
import { handleLogout } from "./logout-action";
import AdminTutorial from "./AdminTutorial";

interface Props {
  children: React.ReactNode;
  adminName: string;
}

const NAV_LINKS = [
  { href: "/", label: "Retour au site", icon: Globe, special: true },
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/parfums", label: "Parfums", icon: Package },
  { href: "/admin/import", label: "Import en masse", icon: FileUp },
  { href: "/admin/logs", label: "Logs d'activité", icon: History },
  { href: "/admin/chat", label: "Chat", icon: MessageSquare },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/trash", label: "Corbeille", icon: Trash2 },
];

export default function AdminShell({ children, adminName }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);

  // Auto-show on first visit (per admin, per browser)
  useEffect(() => {
    const key = `tutorial_seen_${adminName}`;
    if (!localStorage.getItem(key)) {
      setTutorialOpen(true);
    }
  }, [adminName]);

  const closeTutorial = () => {
    localStorage.setItem(`tutorial_seen_${adminName}`, "1");
    setTutorialOpen(false);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gold/10 text-center">
        <Link href="/admin" className="font-serif text-xl gold-text font-bold" onClick={closeDrawer}>
          ADMIN 2 AS
        </Link>
        <div className="mt-2 text-[10px] uppercase tracking-widest text-gray-500">
          Connecté: <span className="text-gold">{adminName}</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          if (link.special) {
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeDrawer}
                className="flex items-center gap-3 px-4 py-3 rounded-sm border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors text-sm gold-text mb-6"
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          }
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeDrawer}
              className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-gold/5 transition-colors text-sm"
            >
              <Icon className="w-4 h-4 text-gold" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gold/10 space-y-2">
        {/* Tuto button */}
        <button
          onClick={() => { setTutorialOpen(true); closeDrawer(); }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-sm hover:bg-gold/5 text-gold/50 hover:text-gold transition-colors text-sm"
        >
          <BookOpen className="w-4 h-4" />
          Guide du dashboard
        </button>

        <form action={handleLogout}>
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-sm hover:bg-red-500/10 text-red-400 transition-colors text-sm min-h-[44px]">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-gold/10 bg-luxury-black flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-luxury-black border-r border-gold/10 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={closeDrawer}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:pl-64 overflow-auto">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-luxury-black border-b border-gold/10 flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 text-gray-400 hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-serif text-sm gold-text font-bold tracking-wider">ADMIN 2 AS</span>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setTutorialOpen(true)}
              className="text-gold/40 hover:text-gold transition-colors"
              aria-label="Ouvrir le guide"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{adminName}</span>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Tutorial modal */}
      {tutorialOpen && (
        <AdminTutorial adminName={adminName} onClose={closeTutorial} />
      )}
    </div>
  );
}
