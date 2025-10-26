"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import "./globals.css";
import { MinimalistNavbar } from "@/components/common/Navbar";

// export const metadata = {
//   title: "AI Career Coach",
//   description: "Create your personalized career roadmap with AI assistance.",
// };

// Navbar'ın GÖSTERİLMEYECEĞİ rotaların listesi
const routesWithoutNavbar = ["/"];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const shouldShowNavbar = !routesWithoutNavbar.includes(pathname);

  return (
    <html lang="tr" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            {shouldShowNavbar && <MinimalistNavbar />}
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
