"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Receipt, BarChart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Trang chủ", icon: Home },
  { href: "/expenses", label: "Chi tiêu", icon: Receipt },
  { href: "/expenses/new", label: "Thêm mới", icon: Plus },
  { href: "/summary", label: "Tổng kết", icon: BarChart },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div className="grid h-full grid-cols-4">
        {links.map((link) => {
          // Special logic for active states to handle path overlaps
          let isActive = false;
          
          if (link.href === "/expenses/new") {
            // "Thêm mới" is only active when exactly on that path
            isActive = pathname === "/expenses/new";
          } else if (link.href === "/expenses") {
            // "Chi tiêu" is active for /expenses but NOT for /expenses/new
            isActive = pathname === "/expenses" || 
                      (pathname.startsWith("/expenses/") && 
                       pathname !== "/expenses/new");
          } else {
            // Other nav items follow standard logic
            isActive = pathname === link.href || pathname.startsWith(link.href);
          }
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center px-2 transition-colors duration-200",
                isActive 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-primary/80"
              )}
            >
              <div className={cn(
                "flex items-center justify-center",
                isActive && "bg-primary/10 p-1.5 rounded-full"
              )}>
                <link.icon className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 