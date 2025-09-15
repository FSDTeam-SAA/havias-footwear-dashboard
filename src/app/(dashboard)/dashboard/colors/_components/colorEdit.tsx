"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Title from "../../_components/Title";

const ColorEdit = ({ id }: { id: string }) => {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;
  const [colorName, setColorName] = useState("");
  const [colorCode, setColorCode] = useState("#fafafa");

  // Fetch single color
  const { data, isLoading } = useQuery({
    queryKey: ["color", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/color/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch color");
      return res.json();
    },
    enabled: !!token && !!id,
  });

  // Prefill form after fetch
  useEffect(() => {
    if (data?.data) {
      setColorName(data.data.name || "");
      setColorCode(data.data.code || "#fafafa");
    }
  }, [data]);

  // Update color
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-color", id],
    mutationFn: async (updatedColor: { name: string; code: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/color/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedColor),
        }
      );

      if (!res.ok) throw new Error("Failed to update color");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Color updated successfully!");
    },
    onError: (error: unknown) => {
      console.error("Update color error:", error);
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name: colorName, code: colorCode });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
        <span className="ml-2">Loading color...</span>
      </div>
    );
  }

  return (
    <div className="">
      <div className="border-b border-gray-200 pb-7">
        <div className="flex items-center justify-between">
           <Title
            title=" Edit Color"
            active="Dashboard >  Edit Color > Edit"
          />

        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mt-10">
        {/* Color Name */}
        <div>
          <label className="block mb-2 font-medium text-[#595959]">
            Color Name
          </label>
          <input
            type="text"
            placeholder="Type color name here..."
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            className="w-full border h-[50px] focus:outline-none outline-none bg-transparent border-[#00000033] rounded-md p-2"
          />
        </div>

        {/* Color Code */}
        <div>
          <label className="block mb-2 font-medium text-[#595959]">
            Color Code
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
        {/* Save Button */}
        <div className="w-full flex justify-end">
          <Button
            type="submit"
            className="mt-4 bg-btnPrimary hover:bg-btnPrimary/60 !h-[50px] text-base w-[100px]"
            disabled={isPending}
          >
            <Save className="!w-[20px] !h-[20px]" /> Save{" "}
            {isPending && (
              <Loader2 className="animate-spin ml-2" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ColorEdit;
