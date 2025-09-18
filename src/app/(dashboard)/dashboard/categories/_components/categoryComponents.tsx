/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import ConfirmationModal from "@/components/confirmationModal";

type SubCategory = {
  _id: string;
  name: string;
};

export interface Category {
  _id: string;
  name: string;
  productType: string[];
  subCategories: SubCategory[];
  createdAt: string;
}

export interface CategoryResponse {
  data: Category[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

const CategoryList = () => {
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const session = useSession();
  const token = (session?.data?.user as { accessToken?: string })?.accessToken;
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery<CategoryResponse>({
    queryKey: ["categories", currentPage],
    queryFn: async () => {
      if (!token) throw new Error("No token available");
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
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const categoriesDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete category");
      }
      return res.json();
    },
    onSuccess: (data: any) => {
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(data.message || "Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete category");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load categories.</div>;
  }

  const confirmDelete = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (categoryToDelete) categoriesDeleteMutation.mutate(categoryToDelete);
    setCategoryToDelete(null);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="border-b border-gray-200 pb-7">
        <div className="flex justify-between w-full">
          <Title title="Categories List" active="Dashboard > Categories > List" />
          <Link href={"/dashboard/categories/add-categories"}>
            <Button
              size="sm"
              className="bg-[#797068] hover:bg-[#3a3129] text-white text-base h-[50px] px-6"
            >
              <Plus className="!h-[22px] !w-[22px]" /> Add Category
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto mt-8">
        <Table className="w-full border-b border-gray-200">
          <TableHeader>
            <TableRow className="border-b border-[#B6B6B6]">
              <TableHead className="text-left font-medium text-[18px] text-[#1C2228] uppercase tracking-wide w-64">
                Name
              </TableHead>
              <TableHead className="text-left font-medium text-[18px] text-[#1C2228] uppercase tracking-wide pl-5 w-64">
                Product Type
              </TableHead>
              <TableHead className="text-left font-medium text-[18px] text-[#1C2228] uppercase tracking-wide w-64">
                Sub Categories
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
            {categories.map((category: Category, index: number) => (
              <TableRow
                key={category._id}
                className={`border-b border-gray-300 ${
                  index === categories.length - 1 ? "border-b-0" : ""
                }`}
              >
                <TableCell className="px-4 py-3">
                  <span className="text-[16px] font-normal text-[#595959]">
                    {category.name}
                  </span>
                </TableCell>

                {/* Product Type Column */}
                <TableCell className="py-3">
                  <div className="flex flex-wrap gap-2">
                    {category.productType?.map((type: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </TableCell>

                {/* Sub Categories Column */}
                <TableCell className="py-3">
                  <div className="flex flex-wrap gap-2">
                    {category.subCategories?.map((sub: SubCategory) => (
                      <span
                        key={sub._id}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
                      >
                        {sub.name}
                      </span>
                    ))}
                    {category.subCategories?.length === 0 && (
                      <span className="text-gray-400 text-sm">No Subcategories</span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-center px-4 py-3">
                  <span className="text-[16px] font-normal text-[#595959]">
                    {new Date(category.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    {new Date(category.createdAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </TableCell>

                <TableCell className="text-center px-4 py-3">
                  <div className="flex justify-center items-center gap-2">
                    <Link href={`/dashboard/categories/edit/${category._id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                        title="Delete Category"
                        onClick={(e) => {
                          e.preventDefault();
                          confirmDelete(category._id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalResults < 10 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4">
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
              <ChevronLeft />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                onClick={() => handlePageChange(page)}
                variant={currentPage === page ? "default" : "outline"}
                className={`h-9 w-9 p-0 ${
                  currentPage === page
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
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        title={`Delete Category`}
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText={`Delete ${categoriesDeleteMutation.isPending ? "..." : ""}`}
        cancelText="Cancel"
      />
    </div>
  );
};

export default CategoryList;
