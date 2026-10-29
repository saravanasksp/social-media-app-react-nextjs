"use client";

import { useActionState } from "react";
import { signInAction, signUpAction } from "@/app/actions";
import type { AuthState } from "@/lib/types";
import { Icon, type IconName } from "./icons";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13.5px] text-ink outline-none transition placeholder:text-muted/70 focus:border-brand/60 focus:ring-4 focus:ring-brand/10";

type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  icon: IconName;
  half?: boolean;
};

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const action = mode === "signin" ? signInAction : signUpAction;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, {});

  const signInFields: Field[] = [
    {
      name: "identifier",
      label: "Username or email",
      placeholder: "maya",
      autoComplete: "username",
      icon: "user",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
      autoComplete: "current-password",
      icon: "lock",
    },
  ];

  const signUpFields: Field[] = [
    {
      name: "displayName",
      label: "Display name",
      placeholder: "Maya Okafor",
      autoComplete: "name",
      icon: "user",
    },
    {
      name: "username",
      label: "Username",
      placeholder: "maya.okafor",
      autoComplete: "username",
      icon: "users",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "you@example.com",
      autoComplete: "email",
      icon: "send",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "At least 8 characters",
      autoComplete: "new-password",
      icon: "lock",
    },
  ];

  const fields = mode === "signin" ? signInFields : signUpFields;

  return (
    <form action={formAction} className="space-y-3">
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            {field.label}
          </span>
          <span className="relative block">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <Icon name={field.icon} size={16} />
            </span>
            <input
              name={field.name}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              required
              minLength={field.name === "password" ? 6 : undefined}
              maxLength={field.name === "bio" ? 300 : 160}
              className={`${inputClass} pl-9`}
            />
          </span>
        </label>
      ))}

      {state.error ? (
        <p className="rounded-xl border border-brand/20 bg-brand-soft px-3.5 py-2.5 text-[12.5px] font-medium text-brand-dark">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-[13.5px] font-semibold text-cream transition hover:bg-black disabled:opacity-70"
      >
        {pending ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-cream/40 border-t-cream" />
            {mode === "signin" ? "Signing in…" : "Creating account…"}
          </>
        ) : (
          <>
            {mode === "signin" ? "Sign in" : "Create account"}
            <Icon name="arrowRight" size={16} />
          </>
        )}
      </button>

      {mode === "signup" ? (
        <p className="text-center text-[11px] leading-relaxed text-muted">
          By joining you agree to keep it kind. We&apos;ll set you up with a few creators to
          follow.
        </p>
      ) : null}
    </form>
  );
}
