import type { Metadata } from "next";
import { SecretFlow } from "./SecretFlow";

export const metadata: Metadata = {
  title: "Dare Accepted",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function SecretPage() {
  return <SecretFlow />;
}
