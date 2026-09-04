import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify a file",
  description:
    "Drop any image, including a re-encoded, cropped, or compressed copy. Fealty computes its perceptual hash and scans the registry for the agent that made it.",
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}