"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", href: "/welcome" },
  { name: "CV vs Job", href: "/cv-vs-job" },
  { name: "Job Match", href: "/job-match" },
  { name: "AI Job Search", href: "/ai-job-search" },
];

export function MinimalistNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const getActiveIndex = () => {
    const index = navItems.findIndex((item) => pathname === item.href);
    return index >= 0 ? index : 0;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/assets/images/logo.png"
                alt="AI Kariyer Koçu Logo"
                width={96}
                height={96}
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <div
              className="flex relative rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(12px)",
                width: "fit-content",
              }}
            >
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative z-10 flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-300",
                    pathname === item.href
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  style={{
                    minWidth: "140px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </Link>
              ))}
              <div
                className="absolute top-0 bottom-0 rounded-2xl transition-transform duration-500 ease-[cubic-bezier(0.37,1.95,0.66,0.56)]"
                style={{
                  width: `${100 / navItems.length}%`,
                  transform: `translateX(${getActiveIndex() * 100}%)`,
                  background: "black",
                  zIndex: 1,
                  justifyContent: "center",
                }}
              />
            </div>

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9"
              >
                {theme === "dark" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                )}
                <span className="sr-only">Temayı değiştir</span>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
