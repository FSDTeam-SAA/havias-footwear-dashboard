"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
        <div className="p-6 bg-gray-100 rounded-lg">
            <div className="border-b border-gray-200 pb-7">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Edit Color
                        </h1>
                        <div className="flex items-center space-x-2 text-sm">
                            <Link
                                href="/dashboard"
                                className="text-gray-500 text-base hover:text-gray-700 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <span className="text-gray-400">›</span>
                            <span className="text-gray-500 text-base">Colors</span>
                            <span className="text-gray-400">›</span>
                            <span className="text-gray-500 text-base">Edit Color</span>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-semibold mb-4">General Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                        className="w-full border focus:outline-none outline-none bg-transparent border-[#00000033] rounded-md p-2"
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
                        <span
                            className="ml-3 text-2xl"
                            style={{ color: colorCode }}
                        >
                            {colorCode}
                        </span>
                    </div>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                    {isPending ? (
                        <>
                            Saving <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        </>
                    ) : (
                        "Save"
                    )}
                </Button>
            </form>
        </div>
    );
};

export default ColorEdit;
