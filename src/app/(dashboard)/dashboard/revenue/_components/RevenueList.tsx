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
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { SellerRevenueResponse } from "../../../../../../types/sellerRevenueType";

const RevenueList = () => {
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading } = useQuery<SellerRevenueResponse>({
    queryKey: ["revenue"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/admin/sellers/revenue`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch sellers revenue");
      return res.json();
    },
    enabled: !!token,
  });

  const revenues = data?.data || [];
  const totalPages = Math.ceil(revenues.length / itemsPerPage);
  const paginatedRevenues = revenues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-7 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Revenue from Sellers</h1>
          <div className="flex items-center space-x-2 text-sm">
            <Link
              href="/dashboard"
              className="text-gray-500 text-base hover:text-gray-700 transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-500 text-base">Revenue from Sellers</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="py-4 font-bold text-[#131313] text-base uppercase leading-[120%] text-center">
                Seller ID
              </TableHead>
              <TableHead className="text-center font-bold text-[#131313] text-base uppercase leading-[120%]">
                Total Revenue
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading
              ? // Skeleton Loader
              Array.from({ length: itemsPerPage }).map((_, idx) => (
                <TableRow
                  key={idx}
                  className="animate-pulse border-b border-gray-200"
                >
                  {/* Seller ID Skeleton */}
                  <TableCell className="text-center px-4 py-4">
                    <div className="h-4 w-24 bg-gray-300 rounded mx-auto"></div>
                  </TableCell>

                  {/* Revenue Skeleton */}
                  <TableCell className="text-center px-4 py-4">
                    <div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div>
                  </TableCell>
                </TableRow>
              ))
              : paginatedRevenues.length > 0
                ? paginatedRevenues.map((seller) => (
                  <TableRow key={seller._id}>
                    <TableCell className="text-center px-4 py-4">
                      <span className="text-base font-medium text-[#424242]">
                        #{seller.sellerId}
                      </span>
                    </TableCell>
                    <TableCell className="text-center px-4 py-4">
                      <span className="text-base font-medium text-[#424242]">
                        ${seller.totalRevenue.toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
                : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-6 text-gray-500">
                      No revenue data found
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2 sm:mb-0">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, revenues.length)}
            </span>{" "}
            of <span className="font-medium">{revenues.length}</span> results
          </p>

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
    </div>
  );
};

export default RevenueList;
