import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToasterWrapper } from "@/components/ToasterWrapper";
import { Navbar } from "@/components/Navbar";
import { GrainOverlay } from "@/components/GrainOverlay";
import { ToastPositionProvider } from "@/lib/ToastPositionContext";
import "emre-toast/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "emre-toast | Premium React Toast Notifications",
  description:
    "The last toast library you'll ever need. Zero deps, streaming, progress, smart grouping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <ToastPositionProvider>
            <GrainOverlay />
            <Navbar />
            {children}
            <ToasterWrapper />
          </ToastPositionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
