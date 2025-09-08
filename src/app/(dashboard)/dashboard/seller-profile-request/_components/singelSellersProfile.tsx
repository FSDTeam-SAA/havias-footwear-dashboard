"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface SingelSellersProfileProps {
    id: string | null;
    open: boolean;
    openChange: (open: boolean) => void;
}

interface SellerData {
    _id: string;
    userId: string; // you may replace with object if needed
    businessEmail: string;
    companyName: string;
    taxId: string;
    isApproved: boolean;
    comments?: string;
    createdAt: string;
    updatedAt: string;
}

interface SellerResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: SellerData;
}

const SingelSellersProfile: React.FC<SingelSellersProfileProps> = ({ id, open, openChange }) => {
    const session = useSession();
    const token = (session?.data?.user as { accessToken: string })?.accessToken;

    const { data: seller, isLoading, isError } = useQuery<SellerResponse>({
        queryKey: ["singel-seller", id],
        queryFn: async () => {
            if (!id) return null;
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch seller");
            return res.json();
        },
    });


    return (
        <Dialog open={open} onOpenChange={openChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Seller Details</DialogTitle>
                    <DialogDescription>Full information about this seller</DialogDescription>
                </DialogHeader>

                {isLoading && <p>Loading...</p>}
                {isError && <p className="text-red-500">Failed to load seller details.</p>}

                {seller?.data && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 py-4">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback>
                                    {seller.data.companyName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-lg font-semibold">{seller.data.companyName}</p>
                                <p className="text-sm text-gray-500">ID: {seller.data._id}</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="font-medium">Business Email:</span> {seller.data.businessEmail}
                            </p>
                            <p>
                                <span className="font-medium">Tax ID:</span> {seller.data.taxId}
                            </p>
                            <p>
                                <span className="font-medium">Status:</span>{" "}
                                {seller?.data.isApproved ? "Approved" : "Rejected"}
                            </p>
                            {seller.data.comments && (
                                <p>
                                    <span className="font-medium">Comments:</span> {seller.data.comments}
                                </p>
                            )}
                            <p>
                                <span className="font-medium">Created At:</span>{" "}
                                {new Date(seller.data.createdAt).toLocaleString()}
                            </p>
                            <p>
                                <span className="font-medium">Updated At:</span>{" "}
                                {new Date(seller.data.updatedAt).toLocaleString()}
                            </p>
                        </div>

                        <DialogFooter>
                            <Button variant="secondary" onClick={() => openChange(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default SingelSellersProfile;
