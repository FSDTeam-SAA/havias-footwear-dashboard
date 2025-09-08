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
import { Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { BuyerProfilesResponse } from "../../../../../../types/buyeresDataType";
import BuyerDetails from "./buyerDetails";

const BuyerList = () => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const session = useSession();
    const token = (session?.data?.user as { accessToken: string })?.accessToken;
    const [id, setId] = useState("");
    const [open, setOpen] = useState(false);

    const openModal = (id: string) => {
        setId(id);
        setOpen(true);
    };

    // Fetch buyers list
    const { data, isLoading } = useQuery<BuyerProfilesResponse>({
        queryKey: ["buyers"],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/admin/buyers`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Failed to fetch buyers");
            return res.json();
        },
        enabled: !!token,
    });
    console.log(isLoading)
    const buyers = data?.data || [];
    const totalPages = Math.ceil(buyers.length / itemsPerPage);

    const paginatedUsers = buyers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            {/* Header Section */}
            <div className="flex justify-between items-center border-[#B6B6B6] pb-7">
                <div>
                    <h1 className="text-2xl font-bold text-[#595959] mb-1">
                        Buyer Profile
                    </h1>
                    <div className="flex items-center space-x-2 text-sm">
                        <Link
                            href="/dashboard"
                            className="text-gray-500 text-base hover:text-gray-700 transition-colors"
                        >
                            Dashboard
                        </Link>
                        <span className="text-gray-400">›</span>
                        <span className="text-gray-500 text-base">Buyer Profile</span>
                    </div>
                </div>
                <Card>
                    <CardContent className="bg-[#797068] flex flex-col items-center rounded-md py-3 px-10">
                        <h1 className="text-[#F4F4F4] font-medium text-[20px]">
                            Total User
                        </h1>
                        <p className="text-[#FFFFFF] font-normal text-[16px]">
                            {buyers.length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Table Section */}
            <div className="w-full mt-6">
                <div className="overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className=" border-[#B6B6B6] border-b border-t ">
                                <TableHead className="text-center py-4 w-40">User Id</TableHead>
                                <TableHead className="text-center py-4 w-40">User Name</TableHead>
                                <TableHead className="text-center py-4 w-32">Total Order</TableHead>
                                <TableHead className="text-center py-4 w-32">Delivered</TableHead>
                                <TableHead className="text-center py-4 w-32">Pending</TableHead>
                                <TableHead className="text-center py-4 w-32">Canceled</TableHead>
                                <TableHead className="text-center py-4 w-40">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedUsers.map((buyer) => (
                                <TableRow key={buyer._id} className="border-[#B6B6B6] border-b">
                                    <TableCell className="text-center text-sm font-medium text-[#595959]">
                                        {buyer._id}
                                    </TableCell>
                                    <TableCell className="text-center text-sm font-medium text-[#595959]">
                                        {buyer.userName}
                                    </TableCell>
                                    <TableCell className="text-center text-sm font-medium text-[#595959]">
                                        {buyer.totalOrders}
                                    </TableCell>
                                    <TableCell className="text-center text-sm font-medium text-green-600">
                                        {buyer.delivered}
                                    </TableCell>
                                    <TableCell className="text-center text-sm font-medium text-orange-600">
                                        {buyer.pending}
                                    </TableCell>
                                    <TableCell className="text-center text-sm font-medium text-red-600">
                                        {buyer.cancelled}
                                    </TableCell>
                                    <TableCell className="text-center px-4 py-4">
                                        <div className="flex justify-center items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 hover:bg-blue-100 hover:text-blue-600"
                                                title="View Details"
                                                onClick={() => openModal(buyer._id)}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
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
                            Showing{" "}
                            <span className="font-medium">
                                {(currentPage - 1) * itemsPerPage + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, buyers.length)}
                            </span>{" "}
                            of <span className="font-medium">{buyers.length}</span> results
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
                        >
                            ‹
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
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
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
                        >
                            ›
                        </Button>
                    </div>
                </div>
            </div>

            {/* Buyer Details Modal */}
            <BuyerDetails id={id} open={open} openChange={setOpen} />
        </div>
    );
};

export default BuyerList;
