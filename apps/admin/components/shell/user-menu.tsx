"use client";

import * as React from "react";
import { LogOut, Settings, User, Globe } from "lucide-react";
import {
  Button,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverItem,
  Separator,
} from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { useI18n, type Locale } from "./i18n";

interface UserMenuProps {
  name?: string;
  email?: string;
  role?: string;
  avatarSrc?: string;
  onLogout?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  className?: string;
}

export function UserMenu({
  name = "Admin User",
  email = "admin@hitsanat.org",
  role = "Chairperson",
  avatarSrc,
  onLogout,
  onProfile,
  onSettings,
  className,
}: UserMenuProps) {
  const { locale, setLocale, t } = useI18n();

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "min-h-[44px] min-w-[44px] md:min-h-auto md:min-w-auto",
          className
        )}
        aria-label={`User menu for ${name}`}
      >
        <Avatar name={name} src={avatarSrc} size="sm" />
        <div className="hidden lg:flex flex-col items-start text-left">
          <span className="text-sm font-medium text-foreground leading-tight">{name}</span>
          <span className="text-xs text-muted-foreground leading-tight">{role}</span>
        </div>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>

        <Separator decorative />

        <PopoverItem onClick={onProfile}>
          <User className="mr-2 h-4 w-4" aria-hidden="true" />
          {t("user.profile")}
        </PopoverItem>

        <PopoverItem onClick={onSettings}>
          <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
          {t("user.settings")}
        </PopoverItem>

        <PopoverItem onClick={() => setLocale(locale === "en" ? "am" : "en")}>
          <Globe className="mr-2 h-4 w-4" aria-hidden="true" />
          {locale === "en" ? "አማርኛ" : "English"}
        </PopoverItem>

        <Separator decorative />

        <PopoverItem onClick={onLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          {t("user.logout")}
        </PopoverItem>
      </PopoverContent>
    </Popover>
  );
}
