"use client";

import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
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
import Title from "../../_components/Title";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { CategoryResponse, Category } from "../../../../../../types/categoryDataType";

const CategoryList = () => {
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading, isError } = useQuery<CategoryResponse>({
    queryKey: ["categories", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/all-categories?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
    enabled: !!token,
  });

  const categories = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalResults = data?.meta?.total ?? 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading categories...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load categories.</div>;
  }

  return (
    <div className="">
      {/* Header */}
      <div className="">
        <div className="flex justify-between w-full">
          <Title
            title="Categories List"
            active="Dashboard > Categories > List"
          />
          <Link href={"/dashboard/categories/add-categories"}>
            <Button
              size="sm"
              className="bg-[#797068] hover:bg-[#3a3129] text-white text-base h-[50px] px-6"
            >
              Add Category
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto mt-8">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-left font-medium text-[18px] text-[#1C2228] uppercase tracking-wide w-80">
                Name
              </TableHead>
              <TableHead className="text-center px-4 py-4 font-medium text-[18px] text-[#1C2228] uppercase tracking-wide w-40">
                Date
              </TableHead>
              <TableHead className="text-center px-4 py-4 font-medium text-[18px] text-[#1C2228] uppercase tracking-wide w-28">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category: Category) => (
              <TableRow key={category._id}>
                {/* Name */}
                <TableCell>
                  <span className="text-[16px] font-normal text-[#595959]">
                    {category.name}
                  </span>
                </TableCell>

                {/* Date */}
                <TableCell className="text-center px-4 py-4">
                  <div className="text-[16px] font-normal text-[#595959]">
                    {new Date(category.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    {new Date(category.createdAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-center px-4 py-4">
                  <div className="flex justify-center items-center gap-2">
                    <Link href={`/dashboard/categories/edit/${category._id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600 transition-colors"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                      title="Delete Category"
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to delete "${category.name}"?`
                          )
                        ) {
                          // TODO: Add delete mutation
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
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
              {Math.min(currentPage * itemsPerPage, totalResults)}
            </span>{" "}
            of <span className="font-medium">{totalResults}</span> results
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
  );
};

export default CategoryList;
