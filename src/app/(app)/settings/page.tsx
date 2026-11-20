"use client"

import { useState } from "react"
import { Bell, KeyRound, Moon, Sun, User } from "lucide-react"
import { SectionHero } from "@/components/layout/section-hero"
import { useTheme } from "@/components/providers/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [saved, setSaved] = useState<string | null>(null)
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    balanceReminders: true,
    weeklyDigest: false,
    pushEnabled: true,
  })

  function flash(message: string) {
    setSaved(message)
    window.setTimeout(() => setSaved(null), 2500)
  }

  return (
    <div className="stagger-children mx-auto max-w-3xl space-y-6">
      <SectionHero
        eyebrow="Account"
        title="Settings"
        description="Appearance, notifications, and account preferences."
      />

      {saved ? (
        <p className="rounded-xl border border-olive-muted bg-olive-soft px-4 py-2.5 text-sm text-olive transition-opacity">
          {saved}
        </p>
      ) : null}

      <section id="appearance" className="surface-card p-5 sm:p-6">
        <h2 className="mb-1 flex items-center gap-2 font-semibold">
          <Sun className="size-4 text-olive" />
          Appearance
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Choose light, dark, or match your system preference.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              { value: "light", label: "Light", icon: Sun },
              { value: "dark", label: "Dark", icon: Moon },
              { value: "system", label: "System", icon: Sun },
            ] as const
          ).map((opt) => {
            const Icon = opt.icon
            const active = theme === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setTheme(opt.value)
                  flash("Theme updated.")
                }}
                className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "border-olive bg-olive-soft text-olive shadow-sm"
                    : "border-border hover:bg-muted"
                }`}
              >
                <Icon className="size-4" />
                {opt.label}
              </button>
            )
          })}
        </div>
      </section>

      <section id="notifications" className="surface-card p-5 sm:p-6">
        <h2 className="mb-1 flex items-center gap-2 font-semibold">
          <Bell className="size-4 text-olive" />
          Notifications
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Control what alerts appear in the notification center.
        </p>
        <div className="space-y-3">
          {(
            [
              ["orderUpdates", "Order updates"],
              ["balanceReminders", "Balance due reminders"],
              ["weeklyDigest", "Weekly revenue digest"],
              ["pushEnabled", "In-app push notifications"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted/40"
            >
              <span className="text-sm font-medium">{label}</span>
              <input
                type="checkbox"
                className="size-4 accent-[var(--olive)]"
                checked={notifications[key]}
                onChange={(e) =>
                  setNotifications((prev) => ({ ...prev, [key]: e.target.checked }))
                }
              />
            </label>
          ))}
        </div>
        <Button
          className="mt-4"
          onClick={() => {
            localStorage.setItem(
              "platter-notifications",
              JSON.stringify(notifications)
            )
            flash("Notification preferences saved.")
          }}
        >
          Save notification preferences
        </Button>
      </section>

      <section id="profile" className="surface-card p-5 sm:p-6">
        <h2 className="mb-1 flex items-center gap-2 font-semibold">
          <User className="size-4 text-olive" />
          Profile
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Display details shown in the sidebar and header.
        </p>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            flash("Profile details saved locally.")
          }}
        >
          <div>
            <Label htmlFor="displayName">Display name</Label>
            <Input id="displayName" name="displayName" defaultValue="Dev Viewer" />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" defaultValue="Catering Manager" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue="dev@example.com"
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Save profile</Button>
          </div>
        </form>
      </section>

      <section id="password" className="surface-card p-5 sm:p-6">
        <h2 className="mb-1 flex items-center gap-2 font-semibold">
          <KeyRound className="size-4 text-olive" />
          Update password
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Used when Supabase Auth is configured. Otherwise password changes are
          managed through your Cursor account for private apps.
        </p>
        <form
          className="grid max-w-md gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            flash("Password update request recorded. Configure Supabase Auth to enforce it.")
            ;(e.target as HTMLFormElement).reset()
          }}
        >
          <div>
            <Label htmlFor="current">Current password</Label>
            <Input id="current" name="current" type="password" required />
          </div>
          <div>
            <Label htmlFor="next">New password</Label>
            <Input id="next" name="next" type="password" minLength={8} required />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input id="confirm" name="confirm" type="password" minLength={8} required />
          </div>
          <Button type="submit">Update password</Button>
        </form>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <h2 className="mb-4 font-semibold">Business preferences</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select id="currency" defaultValue="CAD" disabled>
              <option value="CAD">Canadian Dollar (CAD)</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select id="timezone" defaultValue="America/Toronto">
              <option value="America/Toronto">America/Toronto</option>
              <option value="America/Vancouver">America/Vancouver</option>
              <option value="America/Edmonton">America/Edmonton</option>
            </Select>
          </div>
        </div>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => flash("Business preferences saved.")}
        >
          Save preferences
        </Button>
      </section>
    </div>
  )
}
