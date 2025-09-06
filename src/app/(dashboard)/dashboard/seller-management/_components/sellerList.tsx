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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Eye, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";


const dummyUsers = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        avatar: "https://i.pravatar.cc/150?img=1",
        totalOrder: 25,
        deliveredOrder: 20,
        pendingOrder: 3,
        cancelOrder: 2,
        deliveryDate: "2025-08-01",
    },
    {
        id: 2,
        name: "Sarah Smith",
        email: "sarah@example.com",
        avatar: "https://i.pravatar.cc/150?img=2",
        totalOrder: 40,
        deliveredOrder: 38,
        pendingOrder: 1,
        cancelOrder: 1,
        deliveryDate: "2025-08-12",
    },
     {
        id: 2,
        name: "Sarah Smith",
        email: "sarah@example.com",
        avatar: "https://i.pravatar.cc/150?img=2",
        totalOrder: 40,
        deliveredOrder: 38,
        pendingOrder: 1,
        cancelOrder: 1,
        deliveryDate: "2025-08-12",
    },
     {
        id: 2,
        name: "Sarah Smith",
        email: "sarah@example.com",
        avatar: "https://i.pravatar.cc/150?img=2",
        totalOrder: 40,
        deliveredOrder: 38,
        pendingOrder: 1,
        cancelOrder: 1,
        deliveryDate: "2025-08-12",
    },
     {
        id: 2,
        name: "Sarah Smith",
        email: "sarah@example.com",
        avatar: "https://i.pravatar.cc/150?img=2",
        totalOrder: 40,
        deliveredOrder: 38,
        pendingOrder: 1,
        cancelOrder: 1,
        deliveryDate: "2025-08-12",
    },
     {
        id: 2,
        name: "Sarah Smith",
        email: "sarah@example.com",
        avatar: "https://i.pravatar.cc/150?img=2",
        totalOrder: 40,
        deliveredOrder: 38,
        pendingOrder: 1,
        cancelOrder: 1,
        deliveryDate: "2025-08-12",
    },
     {
        id: 2,
        name: "Sarah Smith",
        email: "sarah@example.com",
        avatar: "https://i.pravatar.cc/150?img=2",
        totalOrder: 40,
        deliveredOrder: 38,
        pendingOrder: 1,
        cancelOrder: 1,
        deliveryDate: "2025-08-12",
    },
     {
        id: 2,
        name: "Sarah Smith",
        email: "sarah@example.com",
        avatar: "https://i.pravatar.cc/150?img=2",
        totalOrder: 40,
        deliveredOrder: 38,
        pendingOrder: 1,
        cancelOrder: 1,
        deliveryDate: "2025-08-12",
    },
];

type User = {
    id: number;
    name: string;
    email: string;
    avatar: string;
    totalOrder: number;
    deliveredOrder: number;
    pendingOrder: number;
    cancelOrder: number;
    deliveryDate: string;
};

const SellerList = () => {
    const itemsPerPage = 7;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const totalPages = Math.ceil(dummyUsers.length / itemsPerPage);


    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const paginatedUsers = dummyUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            {/* Header Section */}
            <div className=" flex justify-between  pb-7">
                <div className="flex items-center justify-between">
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
                            <span className="text-gray-500 text-base">Seller Profile Request</span>
                        </div>
                    </div>
                </div>
                <div>
                    <Card>
                        <CardContent className="bg-[#797068] flex flex-col items-center rounded-md py-3 px-6">
                            <h1 className="text-[#F4F4F4] font-medium text-[20px]">
                                Total Seller
                            </h1>
                            <p className="text-[#FFFFFF] font-normal text-[16px]">4,200.00</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Table Section */}
            <div className="w-full mt-6">
                <div className="overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="border-b border-t border-[#B6B6B6] ">
                                <TableHead className="text-center py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-40">
                                    Seller Id
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
                            {paginatedUsers.map((user) => (
                                <TableRow key={user.id} className="border-b border-t border-[#B6B6B6]">
                                    <TableCell className="text-center text-sm font-medium text-[#595959]">
                                        {user.id}
                                    </TableCell>

                                    <TableCell className="py-4 flex  justify-center">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <p className="text-[#595959] text-[16px] font-medium">
                                                {user.name}
                                            </p>
                                        </div>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-center px-4 py-4">
                                        <div className="flex justify-center items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                                title="View Details"
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                            <Button
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
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* ✅ Fixed Pagination */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="mb-2 sm:mb-0">
                        <p className="text-sm text-gray-600">
                            Showing{" "}
                            <span className="font-medium">
                                {(currentPage - 1) * itemsPerPage + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, dummyUsers.length)}
                            </span>{" "}
                            of <span className="font-medium">{dummyUsers.length}</span> results
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
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
            </div>

            {/* ✅ Modal */}
            <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                <DialogContent className="sm:max-w-md">
                    {selectedUser && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Buyer Details</DialogTitle>
                                <DialogDescription>
                                    Full information about this buyer
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex items-center gap-4 py-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage
                                        src={selectedUser.avatar}
                                        alt={selectedUser.name}
                                    />
                                    <AvatarFallback>
                                        {selectedUser.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-lg font-semibold">{selectedUser.name}</p>
                                    <p className="text-sm text-gray-500">ID: {selectedUser.id}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <p>
                                    <span className="font-medium">Email:</span>{" "}
                                    {selectedUser.email}
                                </p>
                                <p>
                                    <span className="font-medium">Total Orders:</span>{" "}
                                    {selectedUser.totalOrder}
                                </p>
                                <p>
                                    <span className="font-medium">Delivery Date:</span>{" "}
                                    {selectedUser.deliveryDate}
                                </p>
                            </div>

                            <DialogFooter>
                                <Button variant="secondary" onClick={() => setSelectedUser(null)}>
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

export default SellerList;
