"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SellersResponse } from "../../../../../../types/sellersDataType";
import SingelSellersProfile from "./singelSellersProfile";
import { Eye, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const ListOfProfile = () => {
    const itemsPerPage = 7;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const session = useSession();
    const token = (session?.data?.user as { accessToken: string })?.accessToken;
    const queryClient = useQueryClient();

    // Fetch all sellers
    const { data } = useQuery<SellersResponse>({
        queryKey: ["sellers"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/seller`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch sellers");
            return res.json();
        },
        enabled: !!token,
    });

    const sellers = data?.data.data || [];
    const totalPages = Math.ceil(sellers.length / itemsPerPage);
    const paginatedSellers = sellers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Mutation to update status
    const statusMutation = useMutation({
        mutationFn: async ({ sellerId, approve }: { sellerId: string; approve: boolean }) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/${sellerId}/approve`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ approve: approve }),
                }
            );
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to update status");
            return resData;
        },
        onSuccess: (_, { sellerId, approve }) => {
            toast.success(`Seller ${approve ? "Approved" : "Rejected"} successfully`);
            // Update UI instantly
            queryClient.setQueryData<SellersResponse>(["sellers"], (oldData) => {
                if (!oldData) return oldData;
                const updatedData = oldData.data.data.map((s) =>
                    s._id === sellerId ? { ...s, isApproved: approve } : s
                );
                return { ...oldData, data: { ...oldData.data, data: updatedData } };
            });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update status");
        },
    });

    // Mutation to delete seller
    const deleteSellerMutation = useMutation({
        mutationFn: async (sellerId: string) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/${sellerId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to delete seller");
            return resData;
        },
        onSuccess: (_, sellerId) => {
            toast.success("Seller deleted successfully");
            // Remove from UI instantly
            queryClient.setQueryData<SellersResponse>(["sellers"], (oldData) => {
                if (!oldData) return oldData;
                const filtered = oldData.data.data.filter((s) => s._id !== sellerId);
                return { ...oldData, data: { ...oldData.data, data: filtered } };
            });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete seller");
        },
    });

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div>
            {/* Header Section */}
            <div className="flex justify-between pb-7">
                <div>
                    <h1 className="text-2xl font-bold text-[#595959] mb-1">Seller Profile Request</h1>
                    <div className="flex items-center space-x-2 text-sm">
                        <Link
                            href="/dashboard"
                            className="text-gray-500 text-base hover:text-gray-700 transition-colors"
                        >
                            Dashboard
                        </Link>
                        <span className="text-gray-400"> › </span>
                        <span className="text-gray-500 text-base">Seller Profile Request</span>
                    </div>
                </div>

                <Card>
                    <CardContent className="bg-[#797068] flex flex-col items-center rounded-md py-3 px-6">
                        <h1 className="text-[#F4F4F4] font-medium text-[20px]">Total Request</h1>
                        <p className="text-[#FFFFFF] font-normal text-[16px]">{sellers.length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Table Section */}
            <div className="w-full mt-6">
                <div className="overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="border-b border-t border-[#B6B6B6]">
                                {/* <TableHead className="text-center py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-40">
                                    Seller Id
                                </TableHead> */}
                                <TableHead className="text-center py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-40">
                                    Seller Name
                                </TableHead>
                                <TableHead className="text-center py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-40">
                                    Status
                                </TableHead>
                                <TableHead className="text-center py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-40">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedSellers.map((seller) => (
                                <TableRow key={seller._id} className="border-[#B6B6B6]">
                                    {/* <TableCell className="text-center text-sm font-medium text-[#595959]">
                                        {seller._id}
                                    </TableCell> */}
                                    <TableCell className="py-4 flex justify-center">
                                        <p className="text-[#595959] text-[16px] font-medium">{seller.userId.name}</p>
                                    </TableCell>
                                    <TableCell className="text-center py-4 text-sm font-medium">
                                        {seller.isApproved ? "Approved" : "Rejected"}
                                    </TableCell>
                                    <TableCell className="text-center px-4 py-4">
                                        <div className="flex justify-center items-center gap-2">
                                            <Select
                                                onValueChange={(value) =>
                                                    statusMutation.mutate({ sellerId: seller._id, approve: value === "true" })
                                                }
                                            >
                                                <SelectTrigger className="w-[120px] border-none shadow-none rounded-full h-8">
                                                    <SelectValue placeholder="Action" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="true">Approve</SelectItem>
                                                    <SelectItem value="false">Reject</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                                title="View Details"
                                                onClick={() => {
                                                    setSelectedSellerId(seller._id);
                                                    setOpen(true);
                                                }}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                title="Delete User"
                                                onClick={() => deleteSellerMutation.mutate(seller._id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="mb-2 sm:mb-0">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                            <span className="font-medium">{Math.min(currentPage * itemsPerPage, sellers.length)}</span>{" "}
                            of <span className="font-medium">{sellers.length}</span> results
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
                        >
                            ‹
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                variant={currentPage === page ? "default" : "outline"}
                                className={`h-9 w-9 p-0 ${currentPage === page
                                    ? "bg-gray-800 text-white hover:bg-gray-900"
                                    : "border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {page}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
                        >
                            ›
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <SingelSellersProfile id={selectedSellerId} open={open} openChange={setOpen} />
        </div>
    );
};

export default ListOfProfile;
