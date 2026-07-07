import type { Metadata } from "next";
import "./globals.css";
import { AmplifyProvider } from "@/components/AmplifyProvider";

export const metadata: Metadata = {
  title: "Smart Cover Wallet | OM Bank",
  description: "Earn cashback on groceries. Protect your insurance premiums.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AmplifyProvider>{children}</AmplifyProvider>
      </body>
    </html>
  );
}
