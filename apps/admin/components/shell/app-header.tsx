"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { useShell } from "./shell-context";
import { useI18n } from "./i18n";
import { SearchTrigger } from "./global-search";
import { NotificationCenter } from "./notification-center";
import { UserMenu } from "./user-menu";

interface AppHeaderProps {
  className?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  userAvatarSrc?: string;
  onLogout?: () => void;
}

export function AppHeader({
  className,
  userName,
  userEmail,
  userRole,
  userAvatarSrc,
  onLogout,
}: AppHeaderProps) {
  const { setMobileMenuOpen } = useShell();
  const { t } = useI18n();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6",
        className
      )}
    >
      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileMenuOpen(true)}
        aria-label={t("shell.menu")}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>

      {/* Spacer for mobile */}
      <div className="flex-1 md:hidden" />

      {/* Right side controls */}
      <div className="flex items-center gap-1">
        <SearchTrigger className="hidden sm:inline-flex" />
        <NotificationCenter />
        <UserMenu
          name={userName}
          email={userEmail}
          role={userRole}
          avatarSrc={userAvatarSrc}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
