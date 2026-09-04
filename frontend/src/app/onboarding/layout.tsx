import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your passkey identity",
  description:
    "A passkey is the key. Fealty turns it into a self-custodial Monad address with Mera. No seed phrase, nothing to write down.",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}