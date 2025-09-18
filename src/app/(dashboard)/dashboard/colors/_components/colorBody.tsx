"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Loader2, Save } from "lucide-react";
import Title from "../../_components/Title";

const ColorsBody = () => {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;
  const [colorName, setColorName] = useState("");
  const [colorCode, setColorCode] = useState("#fafafa");

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-color"],
    mutationFn: async (newColor: { name: string; code: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/color`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If API requires auth, add:
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newColor),
      });

      if (!res.ok) {
        throw new Error("Failed to create color");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Color created successfully!");
      setColorName("");
      setColorCode("#fafafa");
    },
    onError: (error: unknown) => {
      console.error("Create color error:", error);
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name: colorName, code: colorCode });
  };

  return (
    <div className="">
      <div className="border-b border-gray-200 pb-7">
        <div className="flex items-center justify-between">
          <Title
            title="Add Colors"
            active="Dashboard > Add Colors > Add"
          />

          
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mt-10">
        {/* Colors Name */}
        <div>
          <label className="block mb-2 font-medium text-[#595959]">
            Colors Name
          </label>
          <input
            type="text"
            placeholder="Type Colors Name name here..."
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            className="w-full border focus:outline-none outline-none h-[50px] bg-transparent border-[#00000033] rounded-md p-2"
          />
        </div>

        {/* Colors Code */}
        <div>
          <label className="block mb-2 font-medium text-[#595959]">
            Colors Code
          </label>
          <div className="flex items-center">
            <input
              type="color"
              value={colorCode}
              onChange={(e) => setColorCode(e.target.value)}
              className="w-52 h-20 border rounded-md cursor-pointer"
            />
            <span className="ml-3 text-2xl" style={{ color: colorCode }}>
              {colorCode}
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          {/* <Button
            type="submit"
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Save {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          </Button> */}

          <Button
            type="submit"
            className="mt-4 !h-[50px] !w-[100px] text-base bg-btnPrimary hover:bg-btnPrimary/60"
            disabled={isPending}
          >
            <Save className="!w-[20px] !h-[20px]" /> Save{" "}
            {isPending && <Loader2 className="animate-spin ml-2" />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ColorsBody;
