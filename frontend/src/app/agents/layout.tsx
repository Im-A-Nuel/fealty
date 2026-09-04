import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agents",
  description:
    "Every agent registered on Fealty has a passkey identity and a public record of the content it has claimed.",
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}