"use client";

import { Menu, Server, X } from "lucide-react";
import { useEffect } from "react";

import { StatusLed } from "@/components/ui/StatusLed";
import { NAV_ITEMS, PROFILE } from "@/data";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";

export function Navbar() {
  const activeSection = useAppStore((state) => state.activeSection);
  const isMenuOpen = useAppStore((state) => state.isMenuOpen);
  const toggleMenu = useAppStore((state) => state.toggleMenu);
  const setMenuOpen = useAppStore((state) => state.setMenuOpen);

  // Close the mobile menu on Escape so keyboard users are never trapped.
  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen, setMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gunmetal/80 bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#home"
          className="group flex items-center gap-2.5"
          aria-label={`${PROFILE.name} — back to top`}
        >
          <Server
            aria-hidden="true"
            className="h-4 w-4 text-core transition-transform group-hover:scale-110"
          />
          <span className="font-mono text-sm tracking-tight text-signal">
            motaz
            <span className="text-core">.</span>
            al-masri
          </span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group flex items-center gap-1.5 rounded-sm px-3 py-2 font-mono text-xs tracking-wide transition-colors",
                      isActive
                        ? "text-core"
                        : "text-muted hover:text-signal",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "text-[10px]",
                        isActive ? "text-core" : "text-faint",
                      )}
                    >
                      {item.index}
                    </span>
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <StatusLed />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            Core Online
          </span>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="rounded-sm border border-gunmetal p-2 text-muted transition-colors hover:border-core-dim hover:text-core md:hidden"
        >
          {isMenuOpen ? (
            <X aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Menu aria-hidden="true" className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary mobile"
        hidden={!isMenuOpen}
        className="border-t border-gunmetal bg-void/95 md:hidden"
      >
        <ul className="mx-auto flex w-full max-w-6xl flex-col px-5 py-2 sm:px-8">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex items-center gap-3 border-b border-gunmetal/50 py-3 font-mono text-sm transition-colors",
                    isActive ? "text-core" : "text-muted hover:text-signal",
                  )}
                >
                  <span aria-hidden="true" className="text-[10px] text-faint">
                    {item.index}
                  </span>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
