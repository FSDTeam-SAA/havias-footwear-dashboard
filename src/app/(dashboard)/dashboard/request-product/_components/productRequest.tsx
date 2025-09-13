"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { ProductResponse } from "../../../../../../types/productDataType";
import { toast } from "sonner";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductTable() {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data, isLoading } = useQuery<ProductResponse>({
    queryKey: ["requestsProduct", currentPage, statusFilter],
    queryFn: async () => {
      const statusQuery =
        statusFilter && statusFilter !== "all" ? `&status=${statusFilter}` : "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/all-seller-products?page=${currentPage}&limit=${itemsPerPage}${statusQuery}`,
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
    mutationFn: async ({
      productId,
      status,
    }: {
      productId: string;
      status: "approved" | "rejected";
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/approve/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const resData = await response.json();
      if (!response.ok)
        throw new Error(resData.message || "Failed to update status");
      return resData;
    },
    onSuccess: () => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["requestsProduct"] });
    },
    onError: (error) => {
      toast.error(error.message || "Status update failed");
    },
  });

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const products = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="w-full rounded-lg overflow-hidden">
      <div className="flex justify-between items-center pr-3 mb-10">
        <div className="">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Request Product
          </h1>
          <div className="flex items-center space-x-2 text-sm">
            <Link
              href="/dashboard"
              className="text-gray-500 text-base hover:text-gray-700 transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-500 text-base">Request Product</span>
          </div>
        </div>
        <div>
          <Select onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px] !h-[45px] text-[18px]">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="approved">Approve</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader className="">
          <TableRow className="border-b-2 border-t-2">
            <TableHead className="text-[18px] font-medium text-[#131313]">
              Product Name
            </TableHead>
            <TableHead className="text-[18px] font-medium text-[#131313]">
              Seller Name
            </TableHead>
            <TableHead className="text-[18px] font-medium text-[#131313]">
              ID
            </TableHead>
            <TableHead className="text-[18px] font-medium text-[#131313]">
              Price
            </TableHead>
            <TableHead className="text-[18px] font-medium text-[#131313]">
              Discount Price
            </TableHead>
            <TableHead className="text-[18px] font-medium text-[#131313]">
              Quantity
            </TableHead>
            <TableHead className="text-[18px] font-medium text-[#131313]">
              Date
            </TableHead>
            <TableHead className="text-[18px] font-medium pl-10 text-[#131313]">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx} className="border-b border-gray-100">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-7 w-16 rounded-md" />
                      <Skeleton className="h-7 w-16 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : products.map((product, index) => (
                <TableRow
                  key={product._id}
                  className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                    index % 2 === 1 ? "bg-gray-50/30" : ""
                  }`}
                >
                  <TableCell className="py-4">
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
                      <span className="font-medium text-[#424242] text-base">
                        {product.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={product.createdBy.profileImage}
                          alt={product.createdBy.name}
                        />
                        <AvatarFallback className="text-base bg-gray-200 text-gray-600">
                          {product.createdBy.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font- text-[#424242] text-base">
                        {product.createdBy.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700 text-base font-normal">
                      {product._id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700 text-base font-normal">
                      ${product.unitPrice}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700 text-base font-normal">
                      ${product.discountPrice}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700 text-base font-normal">
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700 text-base font-normal">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white text-base px-3 py-1 h-7 rounded-md font-normal"
                        disabled={product.status === "approved"}
                        onClick={() =>
                          updateStatusMutation.mutate({
                            productId: product._id,
                            status: "approved",
                          })
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
                          updateStatusMutation.mutate({
                            productId: product._id,
                            status: "rejected",
                          })
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
      {!isLoading && meta && meta.total > 10 && (
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
              ‹
            </Button>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  variant={currentPage === page ? "default" : "outline"}
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
              ›
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
