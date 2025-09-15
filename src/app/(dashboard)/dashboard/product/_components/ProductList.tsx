"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Edit, Plus, Search, Trash2 } from "lucide-react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  ProductResponse,
  Product,
} from "../../../../../../types/productDataType";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmationModal from "@/components/confirmationModal";
import Title from "../../_components/Title";

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const sesion = useSession();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const token = (sesion?.data?.user as { accessToken: string })?.accessToken;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<ProductResponse>({
    queryKey: ["products", currentPage, searchTerm],
    queryFn: async () => {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/product/all-products?searchTerm=${encodeURIComponent(
          searchTerm
        )}&page=${currentPage}&limit=${itemsPerPage}`,
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

  const products = data?.data ?? [];
  const meta = data?.meta;
  console.log("meta", meta)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (meta?.totalPages ?? 1)) {
      setCurrentPage(page);
    }
  };

  const getQuantityDisplay = (quantity: number) => {
    return (
      <span
        className={`text-sm font-medium ${
          quantity === 0
            ? "text-red-600"
            : quantity < 50
            ? "text-orange-600"
            : "text-gray-900"
        }`}
      >
        {quantity}
      </span>
    );
  };

  const productDeleteMutation = useMutation({
    mutationFn: async (data: { id: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${data.id}`,
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
        throw new Error(errorData.message || "Failed to delete products");
      }

      return res.json();
    },
    onSuccess: (data) => {
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(data.message || "Product deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  // Open delete confirmation modal
  const confirmDelete = (sellerId: string) => {
    setProductToDelete(sellerId);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (productToDelete) productDeleteMutation.mutate({ id: productToDelete });
    setProductToDelete(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="border-b border-gray-200 pb-8">
        <div className="flex items-center justify-between">
          <Title
            title="Products"
            active="Dashboard > Product > List"
          />

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-[50px] w-full pr-10 border border-[#0000001A]"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <Button
              size="sm"
              className="bg-[#797068] hover:bg-[#3a3129] text-white text-base h-[50px] px-6"
            >
              <Link href="/dashboard/product/add" className="flex items-center">
                <Plus className="!h-5 !w-5 mr-2" />
                Add product
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full mt-14">
        {isLoading ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>MSRP</TableHead>
                  <TableHead>MOQ</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="">
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div className="flex flex-col space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : isError ? (
          <p className="text-center py-10 text-red-500">
            Failed to load products
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-300">
                  <TableHead className="ffont-medium text-[18px] text-[#1C2228] uppercase tracking-wide w-80">Product Name</TableHead>
                  <TableHead className="font-medium text-[18px] text-[#1C2228] uppercase tracking-wide text-center w-24">ID</TableHead>
                  <TableHead className="font-medium text-[18px] text-[#1C2228] uppercase tracking-wide text-center w-24">MSRP</TableHead>
                  <TableHead className="font-medium text-[18px] text-[#1C2228] uppercase tracking-wide text-center w-20">MOQ</TableHead>
                  <TableHead className="font-medium text-[18px] text-[#1C2228] uppercase tracking-wide text-center w-24">Unit Price</TableHead>
                  <TableHead className="font-medium text-[18px] text-[#1C2228] uppercase tracking-wide text-center w-20">Quantity</TableHead>
                  <TableHead className="font-medium text-[18px] text-[#1C2228] uppercase tracking-wide text-center w-40">Date Added</TableHead>
                  <TableHead className="font-medium text-[18px] text-[#1C2228] uppercase tracking-wide text-center w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {products.map((product: Product) => (
                  <TableRow key={product._id}>
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={product.images[0] || "/images/product.png"}
                          alt={product.title}
                          width={80}
                          height={80}
                          className="rounded-lg w-16 h-16 object-cover border border-gray-200"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-normal text-base mb-1 truncate">
                            {product.title}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-base text-center px-4 py-4">
                      #{product._id.slice(-6)}
                    </TableCell>
                    <TableCell className="text-base text-center px-4 py-4">
                      ${product.msrp}
                    </TableCell>
                    <TableCell className="text-base text-center px-4 py-4">
                      {product.moq}
                    </TableCell>
                    <TableCell className="text-base text-center px-4 py-4">
                      ${product.unitPrice}
                    </TableCell>
                    <TableCell className="text-center text-base px-4 py-4">
                      {getQuantityDisplay(product.quantity)}
                    </TableCell>
                    <TableCell className="text-center px-4 py-4">
                      <div className="">
                        <div className="text-base font-normal text-[#424242] px-2 py-1">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500">
                          {new Date(product.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center px-4 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <Link href={`/dashboard/product/edit/${product._id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                          onClick={() => confirmDelete(product._id)}
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
        )}

        {/* Pagination */}
        {meta && !isLoading && meta.total > itemsPerPage && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-gray-200">
            <div className="mb-2 sm:mb-0">
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
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === meta.totalPages}
                className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        title={`Delete Product `}
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText={`Delete ${productDeleteMutation.isPending ? "..." : ""}`}
        cancelText="Cancel"
      />
    </div>
  );
};

export default ProductList;
