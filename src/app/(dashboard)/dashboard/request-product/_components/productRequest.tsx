"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { ProductResponse } from "../../../../../../types/productDataType";
import { toast } from "sonner";
import Link from "next/link";

export function ProductTable() {
    const { data: session } = useSession();
    const token = (session?.user as { accessToken: string })?.accessToken;
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { data, isLoading, isError } = useQuery<ProductResponse>({
        queryKey: ["products", currentPage],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/all-products?page=${currentPage}&limit=${itemsPerPage}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Failed to fetch products");
            return res.json();
        },
        enabled: !!token,
    });

    const handlePageChange = (page: number) => {
        if (page < 1 || page > (data?.meta.totalPages || 1)) return;
        setCurrentPage(page);
    };

    const updateStatusMutation = useMutation({
        mutationFn: async ({ productId, status }: { productId: string; status: "approved" | "rejected" }) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/approve/${productId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            const resData = await response.json();
            if (!response.ok) throw new Error(resData.message || "Failed to update status");
            return resData;
        },
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) => {
            toast.error(error.message || "Status update failed");
        },
    });

    if (isLoading) return <p className="text-center py-10">Loading...</p>;
    if (isError) return <p className="text-center py-10 text-red-500">Error loading products.</p>;

    const products = data?.data || [];
    const meta = data?.meta;

    return (
        <div className="w-full rounded-lg overflow-hidden">
            <div className="mb-8 mt-5">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Request Resource</h1>
                <div className="flex items-center space-x-2 text-sm">
                    <Link
                        href="/dashboard"
                        className="text-gray-500 text-base hover:text-gray-700 transition-colors"
                    >
                        Dashboard
                    </Link>
                    <span className="text-gray-400">›</span>
                    <span className="text-gray-500 text-base">Request Resource</span>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="border-b-2 border-t-2">
                        <TableHead className="font-medium text-gray-700 py-4 px-6 text-left">Product Name</TableHead>
                        <TableHead className="font-medium text-gray-700 py-4 px-6 text-left">Seller Name</TableHead>
                        <TableHead className="font-medium text-gray-700 py-4 px-6 text-left">ID</TableHead>
                        <TableHead className="font-medium text-gray-700 py-4 px-6 text-left">Price</TableHead>
                        <TableHead className="font-medium text-gray-700 py-4 px-6 text-left">Discount Price</TableHead>
                        <TableHead className="font-medium text-gray-700 py-4 px-6 text-left">Quantity</TableHead>
                        <TableHead className="font-medium text-gray-700 py-4 px-6 text-left">Date</TableHead>
                        <TableHead className="font-medium text-gray-700 py-4 px-6 text-left">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product, index) => (
                        <TableRow
                            key={product._id}
                            className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${index % 2 === 1 ? "bg-gray-50/30" : ""
                                }`}
                        >
                            <TableCell className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                            width={100}
                                            height={100}
                                            src={product.images[0] || "/placeholder.svg"}
                                            alt={product.title}
                                            className="w-16 h-16 object-cover"
                                        />
                                    </div>
                                    <span className="font-medium text-gray-900 text-sm">{product.title}</span>
                                </div>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={product.createdBy.profileImage} alt={product.createdBy.name} />
                                        <AvatarFallback className="text-xs bg-gray-200 text-gray-600">
                                            {product.createdBy.name
                                                .split(" ")
                                                .map((n: string) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-gray-900 text-sm">{product.createdBy.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                                <span className="text-gray-700 text-sm font-medium">{product._id}</span>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                                <span className="text-gray-700 text-sm font-medium">${product.unitPrice}</span>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                                <span className="text-gray-700 text-sm font-medium">${product.discountPrice}</span>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                                <span className="text-gray-700 text-sm font-medium">{product.quantity}</span>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                                <span className="text-gray-700 text-sm font-medium">
                                    {new Date(product.createdAt).toLocaleDateString()}
                                </span>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-7 rounded-md font-medium"
                                        disabled={product.status === "approved"}
                                        onClick={() =>
                                            updateStatusMutation.mutate({ productId: product._id, status: "approved" })
                                        }
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-7 rounded-md font-medium"
                                        disabled={product.status === "rejected"}
                                        onClick={() =>
                                            updateStatusMutation.mutate({ productId: product._id, status: "rejected" })
                                        }
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            {meta && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-gray-200">
                    <div className="mb-2 sm:mb-0">
                        <p className="text-sm text-gray-600">
                            Showing{" "}
                            <span className="font-medium">{(meta.page - 1) * meta.limit + 1}</span> to{" "}
                            <span className="font-medium">{Math.min(meta.page * meta.limit, meta.total)}</span> of{" "}
                            <span className="font-medium">{meta.total}</span> results
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

                        {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                variant={currentPage === page ? "default" : "outline"}
                            >
                                {page}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === meta.totalPages}
                            className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
                        >
                            ›
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
