"use client";

import { Button } from "@repo/ui";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" role="img" aria-label="Hitsanat Kifl logo">
              <path d="M12 2v20M2 12h20M12 2l4 4M12 2l-4 4M12 22l4-4M12 22l-4-4M2 12l4 4M2 12l4-4M22 12l-4 4M22 12l-4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-body font-semibold text-foreground">Hitsanat Kifl</h1>
            <p className="text-caption text-muted-foreground">Children&apos;s Ministry</p>
          </div>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-body-small font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
          <Button
            size="sm"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Get Involved
          </Button>
        </nav>

        <button
          type="button"
          className="touch-target flex items-center justify-center md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="flex flex-col px-4 py-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="touch-target flex items-center rounded-md px-3 text-body-small font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button
              className="mt-2"
              size="sm"
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get Involved
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
