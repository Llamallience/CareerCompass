"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/welcome" },
  { name: "CV vs Job", href: "/cv-vs-job" },
  { name: "Job Match", href: "/job-match" },
  { name: "AI Job Search", href: "/ai-job-search" },
];

export function MinimalistNavbar() {
  const pathname = usePathname();

  const getActiveIndex = () => {
    const index = navItems.findIndex((item) => pathname === item.href);
    return index >= 0 ? index : 0;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-24 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/assets/images/logo2.png"
                alt="AI Kariyer Koçu Logo"
                width={200}
                height={200}
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
          </nav>
        </div>
      </div>
    </header>
  );
}
