import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs';
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "ShadowDeploy",
  description: "Next-gen traffic shadowing and testing platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
