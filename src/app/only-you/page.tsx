import type { Metadata } from "next";
import OnlyYouLetter from "./OnlyYouLetter";

export const metadata: Metadata = {
  title: "A letter for you",
  description: "Some things are better said from the heart.",
  robots: { index: false, follow: false },
};

export default function OnlyYouPage() {
  return <OnlyYouLetter />;
}
