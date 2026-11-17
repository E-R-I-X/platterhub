"use client"

import { useActionState } from "react"
import { ChefHat } from "lucide-react"
import { loginAction, type AuthState } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: AuthState = {}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden bg-olive lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 40%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.2), transparent 45%)",
          }}
        />
        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="flex size-11 items-center justify-center rounded-full bg-white/15">
            <ChefHat className="size-6" />
          </div>
          <div>
            <p className="font-display text-2xl font-semibold">The Platter Hub</p>
            <p className="text-xs tracking-[0.18em] text-white/70 uppercase">
              Catering
            </p>
          </div>
        </div>
        <div className="relative z-10 max-w-md text-white">
          <h1 className="font-display text-4xl leading-tight font-semibold">
            Orders from Instagram & TikTok, organised in one place.
          </h1>
          <p className="mt-4 text-white/80">
            Track deliveries, event catering, menus, and revenue — built for your kitchen.
          </p>
        </div>
        <p className="relative z-10 text-sm text-white/60">© 2026 The Platter Hub</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-canvas px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-full bg-olive text-white">
              <ChefHat className="size-5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold">The Platter Hub</p>
              <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                Catering
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in with your owner email to manage orders.
          </p>

          <form action={formAction} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="owner@platterhub.ng"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>

            {state.error ? (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {state.error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 rounded-lg border border-olive-muted bg-olive-soft/60 px-3 py-2 text-xs text-olive-dark">
            Demo mode: use <strong>owner@platterhub.ng</strong> / <strong>platterhub</strong> when
            Supabase is not configured.
          </p>
        </div>
      </div>
    </div>
  )
}
