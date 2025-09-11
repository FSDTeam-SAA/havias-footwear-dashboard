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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
    SellersResponse,
    Seller,
} from "../../../../../../types/sellersDataType";
import SingelSellersProfile from "./singelSllersDetails";
import { toast } from "sonner";

const SellerList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const session = useSession();
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const token = (session?.data?.user as { accessToken: string })?.accessToken;
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery<SellersResponse>({
        queryKey: ["sellers", currentPage, itemsPerPage],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/seller?page=${currentPage}&limit=${itemsPerPage}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Failed to fetch sellers");
            return res.json();
        },
        enabled: !!token,
    });

    const sellers: Seller[] = data?.data?.data || [];
    const meta = data?.data?.meta;
    const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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

    return (
        <div>
            {/* Header Section */}
            <div className="flex justify-between pb-7">
                <div>
                    <h1 className="text-2xl font-bold text-[#595959] mb-1">
                        Seller Profile Request
                    </h1>
                    <div className="flex items-center space-x-2 text-sm">
                        <Link
                            href="/dashboard"
                            className="text-gray-500 text-base hover:text-gray-700 transition-colors"
                        >
                            Dashboard
                        </Link>
                        <span className="text-gray-400">›</span>
                        <span className="text-gray-500 text-base">
                            Seller Profile Request
                        </span>
                    </div>
                </div>
                <Card>
                    <CardContent className="bg-[#797068] flex flex-col items-center rounded-md py-3 px-6">
                        <h1 className="text-[#F4F4F4] font-medium text-[20px]">
                            Total Seller
                        </h1>
                        <p className="text-[#FFFFFF] font-normal text-[16px]">
                            {meta?.total || 0}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Table Section */}
            <div className="w-full mt-6">
                <div className="overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="border-b border-t border-[#B6B6B6] ">
                                <TableHead className="text-center py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-40">
                                    Seller Email
                                </TableHead>
                                <TableHead className="text-center py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-40">
                                    Seller Name
                                </TableHead>
                                <TableHead className="text-center py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-40">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading
                                ? // Skeleton Loader
                                Array.from({ length: itemsPerPage }).map((_, idx) => (
                                    <TableRow key={idx} className="animate-pulse border-b border-t border-[#B6B6B6]">
                                        <TableCell className="py-4 text-center">
                                            <div className="h-4 w-32 bg-gray-300 rounded mx-auto"></div>
                                        </TableCell>
                                        <TableCell className="py-4 flex justify-center items-center gap-3">
                                            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                                            <div className="h-4 w-24 bg-gray-300 rounded"></div>
                                        </TableCell>
                                        <TableCell className="py-4 flex justify-center items-center gap-2">
                                            <div className="h-8 w-20 bg-gray-300 rounded"></div>
                                            <div className="h-8 w-20 bg-gray-300 rounded"></div>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : sellers.length > 0
                                    ? sellers.map((seller) => (
                                        <TableRow
                                            key={seller._id}
                                            className="border-b border-t border-[#B6B6B6]"
                                        >
                                            <TableCell className="text-center text-sm font-medium text-[#595959]">
                                                {seller.businessEmail}
                                            </TableCell>

                                            <TableCell className="py-4 flex justify-center items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={seller.userId.profileImage}
                                                        alt={seller.userId.name}
                                                    />
                                                    <AvatarFallback>
                                                        {seller.userId.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <p className="text-[#595959] text-[16px] font-medium">
                                                    {seller.userId.name}
                                                </p>
                                            </TableCell>

                                            <TableCell className="text-center px-4 py-4">
                                                <div className="flex justify-center items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                                        title="View Details"
                                                        onClick={() => {
                                                            setOpen(true);
                                                            setSelectedUserId(seller._id);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        onClick={() => deleteSellerMutation.mutate(seller._id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-6">
                                                No sellers found
                                            </TableCell>
                                        </TableRow>
                                    )}
                        </TableBody>
                    </Table>
                </div>

                {/* ✅ Pagination */}
                {meta && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing{" "}
                            <span className="font-medium">
                                {(meta.page - 1) * meta.limit + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                                {Math.min(meta.page * meta.limit, meta.total)}
                            </span>{" "}
                            of <span className="font-medium">{meta.total}</span> results
                        </p>

                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                            {/* Previous */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
                            >
                                ‹
                            </Button>

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                (page) => (
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
                                )
                            )}

                            {/* Next */}
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
                )}
            </div>

            {/* ✅ Modal */}
            <SingelSellersProfile open={open} openChange={setOpen} id={selectedUserId} />
        </div>
    );
};

export default SellerList;
