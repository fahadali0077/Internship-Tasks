import type { Metadata } from "next";
import { LoginChoice } from "@/components/auth/LoginChoice";

export const metadata: Metadata = { title: "Log In" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md py-8">
      <div className="rounded-2xl border border-border bg-white p-10 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <LoginChoice />
      </div>
    </div>
  );
}
