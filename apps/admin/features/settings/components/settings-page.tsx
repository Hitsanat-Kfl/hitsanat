"use client";

import { Button, Input } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import {
  Bell,
  Eye,
  EyeOff,
  Globe,
  Key,
  Moon,
  Palette,
  Save,
  Shield,
  Sun,
  User,
} from "lucide-react";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/features/shell/i18n";
import { PageShell } from "@/features/shell";
import { api } from "@/lib/api-client";
import { createClient } from "@/lib/supabase/client";

const T = {
  burgundy: "#32131F",
  gold: "#E5AE60",
  muted: "#7A8599",
  border: "#E7EBEF",
  surface: "#FFFFFF",
  success: "#22C55E",
  successLight: "#DCFCE7",
  destructive: "#EF4444",
  destructiveLight: "#FEF2F2",
} as const;

function SettingsSection({
  icon: Icon,
  title,
  titleAm,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  titleAm?: string;
  description: string;
  children: React.ReactNode;
}) {
  const { locale } = useI18n();
  return (
    <section className="rounded-md border bg-surface" style={{ borderColor: T.border }}>
      <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: T.border }}>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-md"
          style={{ backgroundColor: `${T.burgundy}10`, color: T.burgundy }}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="text-[14px] font-semibold" style={{ color: T.burgundy }}>
            {locale === "am" && titleAm ? titleAm : title}
          </h2>
          <p className="text-[12px]" style={{ color: T.muted }}>
            {description}
          </p>
        </div>
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

function FieldRow({
  label,
  labelAm,
  children,
  description,
}: {
  label: string;
  labelAm?: string;
  description?: string;
  children: React.ReactNode;
}) {
  const { locale } = useI18n();
  return (
    <div
      className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between py-3 border-b last:border-b-0"
      style={{ borderColor: T.border }}
    >
      <div className="sm:min-w-0 sm:flex-1">
        <p className="text-[13px] font-medium" style={{ color: "#182235" }}>
          {locale === "am" && labelAm ? labelAm : label}
        </p>
        {description && (
          <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
            {description}
          </p>
        )}
      </div>
      <div className="sm:ml-4 sm:flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-[#32131F]" : "bg-gray-300"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full sm:w-64 text-[13px] pr-9"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();

  const [userId, setUserId] = React.useState<string>("");
  const [profileName, setProfileName] = React.useState("");
  const [profileEmail, setProfileEmail] = React.useState("");
  const [profileLoading, setProfileLoading] = React.useState(true);
  const [profileSaving, setProfileSaving] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordSaving, setPasswordSaving] = React.useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [emailDigest, setEmailDigest] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [sessionTimeout, setSessionTimeout] = React.useState("30");

  const [notice, setNotice] = React.useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const showNotice = (type: "success" | "error", message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 3000);
  };

  // Load current user profile
  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get<{ user?: { id?: string; name?: string; email?: string } }>(
          "/auth/session"
        );
        if (active && res.user) {
          setUserId(res.user.id ?? "");
          setProfileName(res.user.name ?? "");
          setProfileEmail(res.user.email ?? "");
        }
      } catch {
        // fallback — keep defaults
      } finally {
        if (active) setProfileLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSaveProfile = async () => {
    if (!profileName.trim() || !userId) return;
    setProfileSaving(true);
    try {
      await api.patch(`/users/${userId}`, { name: profileName.trim() });
      showNotice("success", locale === "am" ? "መገለጫ ተቀምጧል!" : "Profile saved!");
      router.refresh();
    } catch {
      showNotice("error", locale === "am" ? "መቀየር አልተሳካም" : "Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return;
    setPasswordSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
        current_password: currentPassword,
      });
      if (error) throw error;
      showNotice("success", locale === "am" ? "የይለፍ ቃል ተቀይጧል!" : "Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg =
        (err as { message?: string })?.message ??
        (locale === "am" ? "የይለፍ ቃል መቀየር አልተሳካም" : "Failed to change password.");
      showNotice("error", msg);
    } finally {
      setPasswordSaving(false);
    }
  };

  const passwordValid =
    currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-5">
          <h1
            className="text-[22px] font-semibold leading-tight tracking-tight sm:text-[24px]"
            style={{ color: T.burgundy }}
          >
            {locale === "am" ? "ማስተካከያዎች" : "Settings"}
          </h1>
          <p className="mt-0.5 text-[12px]" style={{ color: T.muted }}>
            {locale === "am"
              ? "መረጃዎችዎን፣ ምርጫዎችዎን እና ደህንነትዎን ያስተካክሉ"
              : "Manage your profile, preferences, and security settings."}
          </p>
        </header>

        {notice && (
          <div
            className="mb-4 rounded-md border px-3 py-2 text-[12px] font-medium"
            style={{
              borderColor: notice.type === "success" ? T.success : T.destructive,
              backgroundColor: notice.type === "success" ? T.successLight : T.destructiveLight,
              color: notice.type === "success" ? T.success : T.destructive,
            }}
          >
            {notice.message}
          </div>
        )}

        <div className="space-y-4">
          {/* Profile */}
          <SettingsSection
            icon={User}
            title="Profile"
            titleAm="መገለጫ"
            description={locale === "am" ? "መጠቆሚያ መረጃዎችዎ" : "Your account information"}
          >
            <FieldRow label="Full Name" description="Displayed across the system">
              <Input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="h-9 w-full sm:w-64 text-[13px]"
                disabled={profileLoading}
              />
            </FieldRow>
            <FieldRow label="Email Address" description="Used for login and notifications">
              <Input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="h-9 w-full sm:w-64 text-[13px]"
                disabled
              />
            </FieldRow>
            <div className="flex justify-end pt-3">
              <Button
                size="sm"
                onClick={handleSaveProfile}
                disabled={profileSaving || profileLoading || !profileName.trim()}
                className="h-8 text-[12px] font-medium gap-1.5"
                style={{ backgroundColor: T.burgundy, color: "#fff" }}
              >
                <Save className="h-3.5 w-3.5" />
                {profileSaving
                  ? locale === "am"
                    ? "በመቀየር ላይ..."
                    : "Saving..."
                  : locale === "am"
                    ? "ቀይል"
                    : "Save Profile"}
              </Button>
            </div>
          </SettingsSection>

          {/* Change Password */}
          <SettingsSection
            icon={Key}
            title="Change Password"
            titleAm="የይለፍ ቃል ቀይር"
            description={locale === "am" ? "የይለፍ ቃልዎን ያዘምኑ" : "Update your password regularly"}
          >
            <FieldRow label="Current Password">
              <PasswordInput
                value={currentPassword}
                onChange={setCurrentPassword}
                placeholder="••••••••"
              />
            </FieldRow>
            <FieldRow
              label="New Password"
              description={locale === "am" ? "ቢያንስ 8 ቁምፊዎች" : "At least 8 characters"}
            >
              <PasswordInput value={newPassword} onChange={setNewPassword} placeholder="••••••••" />
            </FieldRow>
            <FieldRow
              label="Confirm New Password"
              description={
                newPassword && confirmPassword && newPassword !== confirmPassword
                  ? locale === "am"
                    ? "ቃላት አይመሳሰሉም"
                    : "Passwords do not match"
                  : undefined
              }
            >
              <PasswordInput
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="••••••••"
              />
            </FieldRow>
            <div className="flex justify-end pt-3">
              <Button
                size="sm"
                onClick={handleChangePassword}
                disabled={!passwordValid || passwordSaving}
                className="h-8 text-[12px] font-medium gap-1.5"
                style={{ backgroundColor: T.burgundy, color: "#fff" }}
              >
                <Key className="h-3.5 w-3.5" />
                {passwordSaving
                  ? locale === "am"
                    ? "በመቀየር ላይ..."
                    : "Updating..."
                  : locale === "am"
                    ? "የይለፍ ቃል ቀይር"
                    : "Update Password"}
              </Button>
            </div>
          </SettingsSection>

          {/* Language & Appearance */}
          <SettingsSection
            icon={Palette}
            title="Language & Appearance"
            titleAm="ቋንቋ እና ተመልካች"
            description={
              locale === "am" ? "የምርጫ ቋንቋ እና ገጽታ" : "Customize how the app looks and feels"
            }
          >
            <FieldRow
              label="Language"
              labelAm="ቋንቋ"
              description={locale === "am" ? "የመተግበሪያ ቋንቋ" : "Interface language"}
            >
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setLocale("en")}
                  className={cn(
                    "h-8 rounded-md px-3 text-[12px] font-medium border transition-colors",
                    locale === "en"
                      ? "border-[#32131F] bg-[#32131F] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLocale("am")}
                  className={cn(
                    "h-8 rounded-md px-3 text-[12px] font-medium border transition-colors",
                    locale === "am"
                      ? "border-[#32131F] bg-[#32131F] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  አማርኛ
                </button>
              </div>
            </FieldRow>
            <FieldRow
              label="Dark Mode"
              labelAm="ጨለማ ሁኔታ"
              description={
                locale === "am" ? "የመመልከቻ ሁኔታ ቀይር" : "Switch between light and dark themes"
              }
            >
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" style={{ color: darkMode ? T.muted : T.gold }} />
                <Toggle checked={darkMode} onChange={setDarkMode} label="Dark mode toggle" />
                <Moon className="h-4 w-4" style={{ color: darkMode ? T.burgundy : T.muted }} />
              </div>
            </FieldRow>
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection
            icon={Bell}
            title="Notifications"
            titleAm="ማሳወቂያዎች"
            description={locale === "am" ? "የማሳወቂያ ምርጫዎችዎ" : "Choose what you get notified about"}
          >
            <FieldRow
              label="Push Notifications"
              labelAm="ፑሽ ማሳወቂያዎች"
              description={
                locale === "am" ? "በአፕlication ውስጥ ማሳወቂያዎች" : "In-app notification alerts"
              }
            >
              <Toggle
                checked={notificationsEnabled}
                onChange={setNotificationsEnabled}
                label="Push notifications toggle"
              />
            </FieldRow>
            <FieldRow
              label="Email Digest"
              labelAm="የኢሜይል ማጠቃለያ"
              description={locale === "am" ? "ሳምንታዊ የኢሜይል ማጠቃለያ" : "Weekly summary of activity"}
            >
              <Toggle checked={emailDigest} onChange={setEmailDigest} label="Email digest toggle" />
            </FieldRow>
          </SettingsSection>

          {/* Security */}
          <SettingsSection
            icon={Shield}
            title="Security"
            titleAm="ደህንነት"
            description={locale === "am" ? "የመሃላ ደህንነት ቅንዓቶች" : "Account protection settings"}
          >
            <FieldRow
              label="Two-Factor Authentication"
              labelAm="ሁለት ደረጃ ማረጋገጫ"
              description={locale === "am" ? "ተጨማሪ ደህንነት ለመጨመር" : "Add an extra layer of security"}
            >
              <Toggle
                checked={twoFactor}
                onChange={setTwoFactor}
                label="Two-factor authentication toggle"
              />
            </FieldRow>
            <FieldRow
              label="Session Timeout (minutes)"
              labelAm="የክፍል ጊዜ (ደቂቃ)"
              description={
                locale === "am" ? "አwaitFor duration በኋላ ይወጣል" : "Auto-logout after inactivity"
              }
            >
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="h-9 rounded-md border px-2 text-[13px]"
                style={{ borderColor: T.border, color: "#182235" }}
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">60 min</option>
                <option value="120">120 min</option>
              </select>
            </FieldRow>
          </SettingsSection>
        </div>
      </div>
    </PageShell>
  );
}
