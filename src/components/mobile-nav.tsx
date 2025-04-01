"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Receipt, BarChart, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Trang chủ", icon: Home },
  { href: "/expenses", label: "Chi tiêu", icon: Receipt },
  { href: "/expenses/new", label: "Thêm mới", icon: Plus },
  { href: "/summary", label: "Tổng kết", icon: BarChart },
  { href: "/users", label: "Người dùng", icon: Users },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div className="grid h-full grid-cols-5">
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
          } else if (link.href === "/users") {
            // "Người dùng" is active for /users and all subpaths
            isActive = pathname === "/users" || pathname.startsWith("/users/");
          } else {
            // Other nav items follow standard logic
            isActive = pathname === link.href || pathname.startsWith(link.href);
          }
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center h-full w-full text-xs space-y-1",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 