"use client";

import React, { useState } from "react";
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Order, OrderResponse } from "../../../../../../types/orderDataType";

const itemsPerPage = 7;

const RecentOrders = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const session = useSession();
    const token = (session?.data?.user as { accessToken: string })?.accessToken;

    const { data, isLoading } = useQuery<OrderResponse>({
        queryKey: ["orders", currentPage],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/order?sortOrder=desc?page=${currentPage}&limit=${itemsPerPage}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Failed to fetch orders");
            return res.json();
        },
        enabled: !!token,
    });

    const orders = data?.data || [];
    const totalPages = data?.meta?.totalPages || 1;

    return (
        <div>
            {/* ✅ Table */}
            <div className="w-full mt-6">
                <div className="overflow-x-auto">
                    <Table className="w-full ">
                        <TableHeader className="">
                            <TableRow className="">
                                <TableHead className=" py-4 font-bold text-[20px] text-[#1C2228] text-sm uppercase tracking-wide w-60">
                                    Product
                                </TableHead>
                                <TableHead className=" py-4 font-bold text-[20px] text-[#1C2228] text-sm uppercase tracking-wide w-32">
                                    Price
                                </TableHead>
                                <TableHead className=" py-4 font-bold text-[20px] text-[#1C2228] text-sm uppercase tracking-wide w-40">
                                    Delivery Date
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading
                                ? Array.from({ length: itemsPerPage }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="py-4 flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-gray-300 animate-pulse"></div>
                                            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : orders.map((order) =>
                                    order.items.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell className="py-4  flex gap-3 items-center">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage
                                                        src={item.product?.images[0] || ""}
                                                        alt={item.product?.title || "N/A"}
                                                    />
                                                    <AvatarFallback>
                                                        {item.product?.title?.charAt(0).toUpperCase() || "N/A"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <p className="text-[#595959] text-[16px] font-medium">
                                                    {item.product?.title?.slice(0, 10) || "N/A"}
                                                </p>
                                            </TableCell>

                                            <TableCell className=" text-sm font-medium text-[#1C2228]">
                                                ${item.unitPrice.toFixed(2)}
                                            </TableCell>

                                            <TableCell className=" text-sm font-medium text-[#595959]">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                        </TableBody>
                    </Table>
                </div>

                {/* ✅ Pagination */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center px-6 py-4 bg-gray-50 border-t border-gray-200 gap-4">
                    <p className="text-sm text-gray-600">
                        Showing{" "}
                        <span className="font-medium">
                            {(currentPage - 1) * itemsPerPage + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, data?.meta?.total || 0)}
                        </span>{" "}
                        of <span className="font-medium">{data?.meta?.total || 0}</span> results
                    </p>

                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() =>
                                        currentPage > 1 && setCurrentPage(currentPage - 1)
                                    }
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === page}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() =>
                                        currentPage < totalPages && setCurrentPage(currentPage + 1)
                                    }
                                    className={
                                        currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>

            {/* ✅ Modal */}
            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="sm:max-w-md">
                    {selectedOrder && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                                <DialogDescription>
                                    Full information about this order
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex items-center gap-4 py-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage
                                        src={selectedOrder.items[0]?.product?.images[0] || ""}
                                        alt={selectedOrder.items[0]?.product?.title || "Deleted Product"}
                                    />
                                    <AvatarFallback>
                                        {selectedOrder.items[0]?.product?.title?.charAt(0).toUpperCase() || "X"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-lg font-semibold">
                                        {selectedOrder.items[0]?.product?.title || "Deleted Product"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Order ID: {selectedOrder._id}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <p>
                                    <span className="font-medium">Total:</span> ${selectedOrder.total.toFixed(2)}
                                </p>
                                <p>
                                    <span className="font-medium">Buyer:</span> {selectedOrder.buyer.name} ({selectedOrder.buyer.email})
                                </p>
                                <p>
                                    <span className="font-medium">Shipping:</span> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}
                                </p>
                                <p>
                                    <span className="font-medium">Payment:</span> {selectedOrder.paymentInfo.method} ({selectedOrder.paymentInfo.status})
                                </p>
                                <div className="mt-2">
                                    <span className="font-medium">Items:</span>
                                    {selectedOrder.items.map((item) => (
                                        <div key={item._id} className="flex justify-between py-1">
                                            <span>{item.product?.title || "Deleted Product"}</span>
                                            <span>{item.quantity} x ${item.unitPrice.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
                                    Close
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RecentOrders;
