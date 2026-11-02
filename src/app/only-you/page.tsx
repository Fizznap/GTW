import type { Metadata } from "next";
import OnlyYouExperience from "./OnlyYouExperience";

export const metadata: Metadata = {
  title: "Only You — A little story",
  description: "A little story, made with care.",
  robots: { index: false, follow: false },
};

export default function OnlyYouPage() {
  return <OnlyYouExperience />;
}
