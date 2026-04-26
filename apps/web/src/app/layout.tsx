import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lovixa — Group Decision Making Made Easy",
  description: "Eliminate decision fatigue with real-time group voting and consensus detection.",
};

import { StoreProvider } from '@/store/StoreProvider';
import { AuthProvider } from '@/components/AuthProvider/AuthProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
