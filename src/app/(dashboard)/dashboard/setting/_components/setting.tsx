"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import ChangePasswordModal from "./chnagePassword";

const Setting = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Card>
        <div className="">
          <CardTitle>
            <div className="mb-10">
              <h1 className="text-2xl font-bold text-[#1C2228] mb-1">
                Settings{" "}
              </h1>
              <div className="flex items-center space-x-2 text-sm">
                <Link
                  href="/dashboard"
                  className="text-gray-500 text-base hover:text-gray-700 transition-colors"
                >
                  Dashboard
                </Link>
                <span className="text-gray-400">›</span>
                <span className="text-gray-500 text-base">Settings</span>
              </div>
            </div>
          </CardTitle>
          <CardContent className="p-0 space-y-5">
            <Link href={"/dashboard/setting/personal-info"}>
              <div className="flex border border-[#BABABA] rounded-md py-[18px] px-4  justify-between items-center">
                <h2 className="text-[#1F2937] font-medium">
                  Personal Information
                </h2>
                <ChevronRight />
              </div>
            </Link>
            <div
              onClick={() => setIsOpen(true)}
              className="flex border cursor-pointer border-[#BABABA] rounded-md py-[18px] px-4  justify-between items-center"
            >
              <h2 className="text-[#1F2937] font-medium">Change Password</h2>
              <ChevronRight />
            </div>
            {/* <div className='flex border border-[#BABABA] cursor-pointer rounded-md py-[18px] px-4  justify-between items-center'>
                            <h2 className='text-[#1F2937] font-medium'>Login Image control</h2>
                            <ChevronRight />
                        </div> */}
          </CardContent>
        </div>
        <ChangePasswordModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </Card>
    </div>
  );
};

export default Setting;
