"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import logo from "@/public/images/haviasFooterLogo.png";
import {
  LayoutDashboard,
  DollarSign,
  LogOut,
  Grip,
  Columns3Cog,
  AppWindow,
  User2,
  UserCheck,
  Users,
  Settings,
  Handbag,
  ChevronDown,
  ChevronRight,
  CheckCheck,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LogoutModal } from "../logoutModal";

type NavItem = {
  name: string;
  href?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: { name: string; href: string }[];
};

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Categories",
    icon: Columns3Cog,
    children: [
      { name: "Category List", href: "/dashboard/categories" },
      {
        name: "Add Sub Category",
        href: "/dashboard/categories/add-sub-categories",
      },
    ],
  },
  { name: "Product", href: "/dashboard/product", icon: Grip },
  {
    name: "Product Request",
    href: "/dashboard/request-product",
    icon: CheckCheck,
  },
  { name: "Colors", href: "/dashboard/colors", icon: Grip },
  { name: "Order", href: "/dashboard/orders", icon: Handbag },
  { name: "Revenue from Seller", href: "/dashboard/revenue", icon: DollarSign },
  { name: "Blog management", href: "/dashboard/blog", icon: AppWindow },
  {
    name: "Seller Management",
    href: "/dashboard/seller-management",
    icon: User2,
  },
  {
    name: "Seller Profile Request",
    href: "/dashboard/seller-profile-request",
    icon: UserCheck,
  },
  { name: "Buyer Profile", href: "/dashboard/buyer-profile", icon: Users },
  { name: "Setting", href: "/dashboard/setting", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  // Auto-open dropdown if current path is inside children
  useEffect(() => {
    const activeDropdown = navigation.find(
      (item) =>
        item.children &&
        item.children.some((child) => pathname.startsWith(child.href))
    );
    setOpenDropdown(activeDropdown ? activeDropdown.name : null);
  }, [pathname]);

  return (
    <div className="flex h-screen sticky bottom-0 top-0 w-[350px] flex-col bg-[#1C2228] z-50">
      {/* Logo */}
      <div className="h-[80px] flex items-center justify-start shadow-md px-4">
        <Image
          src={logo}
          alt="Company Logo"
          height={60}
          width={150}
          className="object-contain"
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3 flex hide-scrollbar flex-col items-center justify-start px-3 overflow-y-auto mt-3">
        {navigation.map((item) => {
          let isActive = false;

          if (item.children) {
            isActive = item.children.some((child) => pathname === child.href);
          } else if (item.href) {
            isActive = pathname === item.href;
          }

          // Dropdown
          if (item.children && item.icon) {
            const isOpen = openDropdown === item.name;
            return (
              <div key={item.name} className="w-[90%] mx-auto">
                <Link
                  href="/dashboard/categories" // parent route
                  onClick={(e) => {
                    // If already open, just toggle
                    if (isOpen) {
                      e.preventDefault();
                      setOpenDropdown(null);
                    } else {
                      setOpenDropdown(item.name);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-normal transition-all duration-200",
                    pathname.startsWith("/dashboard/categories")
                      ? "bg-btnPrimary text-white"
                      : "text-white hover:bg-btnPrimary/70 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-6 w-6" />
                    <span className="text-base">{item.name}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Link>

                {/* Dropdown children */}
                {isOpen && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                            childActive
                              ? "bg-btnPrimary text-white"
                              : "text-white hover:bg-btnPrimary/70 hover:text-white"
                          )}
                        >
                          <span className="text-base">{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Regular items
          if (item.href && item.icon) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex w-[90%] mx-auto items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-btnPrimary text-white"
                    : "text-white hover:bg-btnPrimary/70 hover:text-white"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-[18px] !font-normal leading-[120%]">{item.name}</span>
              </Link>
            );
          }

          return null;
        })}
      </nav>

      {/* Logout */}
      <div
        onClick={() => setIsLogoutModalOpen(true)}
        className="p-3 ml-4 cursor-pointer"
      >
        <div className="flex gap-2 items-center justify-start rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-600/50 hover:text-white">
          <div>
            <LogOut className="h-5 w-5" />
          </div>
          <div className="font-normal text-base leading-[120%]">Log Out</div>
        </div>
      </div>
      <LogoutModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
      />
    </div>
  );
}
