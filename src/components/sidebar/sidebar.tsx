"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import logo from "@/public/images/haviasFooterLogo.png";
import {
  LayoutDashboard,
  DollarSign,
  FileText,
  LogOut,
  ShoppingCart,
  Grip,
  ShoppingBasket,
  Scissors,
  // Bell,
} from "lucide-react";
import Image from "next/image";
// import logoImage from "@/public/images/logo.svg";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Product", href: "/product", icon: Grip },
  { name: "Revenue from Seller ", href: "/revenue", icon: ShoppingBasket },
  { name: "Blog management", href: "/blog", icon: ShoppingCart },
  { name: "Fabric", href: "/fabric", icon: FileText },
  // { name: "Message", href: "/message", icon: MessageSquare },
  { name: "Style", href: "/style", icon: Scissors },
  {
    name: "Accents",
    href: "/accents",
    icon: DollarSign,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen sticky bottom-0 top-0 w-[350px] flex-col bg-[#1C2228] z-50">
      <div className="h-[80px] flex items-center justify-start shadow-md px-4">
        <Image
          src={logo}
          alt="Company Logo"
          height={60} // Adjust height to fit navbar
          width={150} // Adjust width proportionally
          className="object-contain"
          priority // for faster loading
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 flex flex-col items-center justify-start px-3 overflow-y-auto mt-3">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex w-[90%] mx-auto items-center justify-start gap-2 space-y-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white text-black"
                  : "text-slate-300 hover:bg-slate-600/50 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6 transition-colors duration-200",
                  isActive ? "text-black" : ""
                )}
              />
              <span
                className={cn(
                  "font-normal text-base leading-[120%] transition-colors duration-200 text-center",
                  isActive ? "text-black font-medium" : ""
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout fixed at bottom */}
      <div className="p-3">
        <div className="flex items-center justify-start space-y-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-600/50 hover:text-white cursor-pointer">
          <LogOut className="h-5 w-5" />
          <span className="font-normal text-base leading-[120%]">Log Out</span>
        </div>
      </div>
    </div>
  );
}
