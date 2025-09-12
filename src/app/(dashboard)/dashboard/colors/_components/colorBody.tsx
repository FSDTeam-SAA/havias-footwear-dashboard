"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';


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
        <div className="p-6 bg-gray-100 rounded-lg">
            <div className="border-b border-gray-200 pb-7">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Add Colors
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
                            <span className="text-gray-500 text-base">Add Colors</span>
                        </div>
                    </div>

                    <Button
                        size="sm"
                        className="bg-[#797068] hover:bg-[#3a3129] text-white text-base h-[50px] px-6"
                    >
                        <Link href="/dashboard/colors/color-add" className="flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Color
                        </Link>
                    </Button>
                </div>
            </div>

            <h2 className="text-lg font-semibold mb-4">General Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Colors Name */}
                <div>
                    <label className="block mb-2 font-medium text-[#595959]">Colors Name</label>
                    <input
                        type="text"
                        placeholder="Type Colors Name name here..."
                        value={colorName}
                        onChange={(e) => setColorName(e.target.value)}
                        className="w-full border focus:outline-none outline-none bg-transparent border-[#00000033] rounded-md p-2"
                    />
                </div>

                {/* Colors Code */}
                <div>
                    <label className="block mb-2 font-medium text-[#595959]">Colors Code</label>
                    <div className='flex items-center'>
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
                <Button type="submit" className="bg-gray-600 hover:bg-gray-700 text-white">
                    Save {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                </Button>
            </form>
        </div>
    )
}

export default ColorsBody