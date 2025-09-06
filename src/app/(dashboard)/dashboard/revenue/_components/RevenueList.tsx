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
const dummyCategories = [
  { id: 1, seller_id: "1140", product_id: "11110", revenue: "$1500" },
  { id: 2, seller_id: "1140", product_id: "11110", revenue: "$1500" },
  { id: 3, seller_id: "1140", product_id: "11110", revenue: "$1500" },
  { id: 4, seller_id: "1140", product_id: "11110", revenue: "$1500" },
  { id: 5, seller_id: "1140", product_id: "11110", revenue: "$1500" },
  { id: 6, seller_id: "1140", product_id: "11110", revenue: "$1500" },
  { id: 7, seller_id: "1140", product_id: "11110", revenue: "$1500" },
];

const RevenueList = () => {
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dummyCategories.length / itemsPerPage);
  const paginatedCategories = dummyCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-7 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Revenue from Seller </h1>
          <div className="flex items-center space-x-2 text-sm">
            <Link
              href="/dashboard"
              className="text-gray-500 text-base hover:text-gray-700 transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-500 text-base">Revenue from Seller </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="py-4 font-bold text-[#131313] text-base uppercase leading-[120%] w-10 text-center">
                Seller ID
              </TableHead>
              <TableHead className="text-center font-bold text-[#131313] text-base uppercase leading-[120%] w-24">
                Product ID
              </TableHead>
              <TableHead className="text-center font-bold text-[#131313] text-base uppercase leading-[120%] w-24">
                Revenue from Seller
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedCategories.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="text-center px-4 py-4">
                  <span className="text-base font-medium text-[#424242] px-2 py-1">
                    #{product.seller_id}
                  </span>
                </TableCell>
                <TableCell className="text-center px-4 py-4">
                  <span className="text-base font-medium text-[#424242]  ">
                    {product.product_id}
                  </span>
                </TableCell>
                <TableCell className="text-center px-4 py-4">
                  <span className="text-base font-medium text-[#424242]  ">
                    {product.revenue}
                  </span>
                </TableCell>
              </TableRow>
            ))}
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
              {Math.min(currentPage * itemsPerPage, dummyCategories.length)}
            </span>{" "}
            of <span className="font-medium">{dummyCategories.length}</span> results
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
