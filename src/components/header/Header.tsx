"use client";

import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { UserProfileResponse } from "../../../types/userDataType";
import { useSession } from "next-auth/react";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data } = useQuery<UserProfileResponse>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    enabled: !!token,
  });


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };




  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex h-[80px] items-center justify-between px-6 bg-[#1C2228] shadow-md">
      <div className="flex items-center space-x-2"></div>

      <div className="relative flex items-center space-x-3">
        <div
          ref={avatarRef}
          className="flex items-center space-x-2 text-white text-sm cursor-pointer hover:bg-white/10 rounded-lg px-2 py-1 transition-colors"
          onClick={toggleDropdown}
        >
          <span>{data?.data.email}</span>
          <Avatar className="h-8 w-8">
            <AvatarImage src={data?.data.profileImage} />
            <AvatarFallback className="text-black">{data?.data?.name?.charAt(2)}</AvatarFallback>
          </Avatar>
        </div>


      </div>

      {/* <ChangePasswordModal isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </div>
  );
}