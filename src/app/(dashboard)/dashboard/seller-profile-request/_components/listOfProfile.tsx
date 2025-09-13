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
import ConfirmationModal from "@/components/confirmationModal";

const ListOfProfile = () => {
    const itemsPerPage = 7;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [sellerToDelete, setSellerToDelete] = useState<string | null>(null);
    const session = useSession();
    const token = (session?.data?.user as { accessToken: string })?.accessToken;
    const queryClient = useQueryClient();

    // Fetch all sellers
    const { data, isLoading } = useQuery<SellersResponse>({
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
        mutationFn: async ({ sellerId, isApproved }: { sellerId: string; isApproved: string }) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/${sellerId}/approve`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ isApproved }),
                }
            );

            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to update status");
            return resData;
        },
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["sellers"] });

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


    // Open delete confirmation modal
    const confirmDelete = (sellerId: string) => {
        setSellerToDelete(sellerId);
        setDeleteModalOpen(true);
    };


    const handleDelete = () => {
        if (sellerToDelete) deleteSellerMutation.mutate(sellerToDelete);
        setDeleteModalOpen(false);
        setSellerToDelete(null);
    };

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
            <div className="w-full flex-1 h-full mt-6">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        // Skeleton Loader
                        <div className="space-y-4">
                            {Array.from({ length: itemsPerPage }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center border-b border-[#B6B6B6] px-4 py-4 animate-pulse"
                                >
                                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                                    <div className="flex gap-2">
                                        <div className="h-8 w-24 bg-gray-300 rounded"></div>
                                        <div className="h-8 w-24 bg-gray-300 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="border-b border-t border-[#B6B6B6]">
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
                                        <TableCell className="py-4 flex justify-center">
                                            <p className="text-[#595959] text-[16px] font-medium">
                                                {seller.userId.name}
                                            </p>
                                        </TableCell>

                                        <TableCell className="text-center py-4 text-sm font-medium">
                                            {seller.isApproved === "approved" ? (
                                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                                    Approved
                                                </span>
                                            ) : seller.isApproved === "reject" ? (
                                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                                                    Rejected
                                                </span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                                                    Pending
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-center px-4 py-4">
                                            <div className="flex justify-center items-center gap-2">
                                                <Select
                                                    onValueChange={(value) =>
                                                        statusMutation.mutate({ sellerId: seller._id, isApproved: value })
                                                    }
                                                >
                                                    <SelectTrigger className="w-[120px] border-none shadow-none rounded-full h-8">
                                                        <SelectValue placeholder="Action" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="approved">Approve</SelectItem>
                                                        <SelectItem value="reject">Reject</SelectItem>
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
                                                    onClick={() => confirmDelete(seller._id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
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

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
                title="Delete Seller"
                description="Are you sure you want to delete this seller? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
            {/* Modal */}
            <SingelSellersProfile id={selectedSellerId} open={open} openChange={setOpen} />
        </div>
    );
};

export default ListOfProfile;
