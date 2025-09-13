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
import {
  CategoryResponse,
  Category,
} from "../../../../../../types/categoryDataType";
import { toast } from "sonner";
import ConfirmationModal from "@/components/confirmationModal";

const CategoryList = () => {
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
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
  console.log(totalResults);
  console.log("totalpage", totalPages);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const categoriesDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete categories");
      }

      return res.json();
    },
    onSuccess: (data) => {
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(data.message || "categories deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete categories");
    },
  });

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading categories...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load categories.</div>;
  }

  // Open delete confirmation modal
  const confirmDelete = (sellerId: string) => {
    setCategoryToDelete(sellerId);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (categoryToDelete) categoriesDeleteMutation.mutate(categoryToDelete);
    setCategoryToDelete(null);
  };

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
              <Plus className="!h-[22px] !w-[22px]"/>
              Add Category
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto mt-8">
        <Table className="w-full border-b border-[#B6B6B6]">
          <TableHeader>
            <TableRow className="border-b border-[#B6B6B6]">
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
            {categories.map((category: Category, index) => (
              <TableRow
                key={category._id}
                className={`border-b border-[#B6B6B6] ${
                  index === categories.length - 1 ? "border-b-0" : ""
                }`}
              >
                <TableCell className="px-4 py-3">
                  <span className="text-[16px] font-normal text-[#595959]">
                    {category.name}
                  </span>
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
                    <Link href={`/dashboard/categories/edit/${category._id}`} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                      title="Delete Category"
                      onClick={() => confirmDelete(category._id)}
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
      {totalResults > itemsPerPage && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 bg-white border-t border-gray-200">
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
        title={`Delete Category `}
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText={`Delete ${
          categoriesDeleteMutation.isPending ? "..." : ""
        }`}
        cancelText="Cancel"
      />
    </div>
  );
};

export default CategoryList;
