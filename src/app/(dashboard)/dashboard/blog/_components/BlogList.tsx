"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
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
import { BlogsResponse } from "../../../../../../types/blogDataType";
import { toast } from "sonner";
import ConfirmationModal from "@/components/confirmationModal";

const BlogList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const session = useSession();
  const queryClient = useQueryClient();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  const { data, isLoading } = useQuery<BlogsResponse>({
    queryKey: ["blog", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/all-blogs?page=${currentPage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    },
    enabled: !!token,
  });


  const blogs = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;

  const blogDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/${id}`,
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
        throw new Error(errorData.message || "Failed to delete blog");
      }

      return res.json();
    },
    onSuccess: (data) => {
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      toast.success(data.message || "Blog deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete blog");
    },
  });


  // Open delete confirmation modal
  const confirmDelete = (sellerId: string) => {
    setBlogToDelete(sellerId);
    setDeleteModalOpen(true);
  };


  const handleDelete = () => {
    if (blogToDelete) blogDeleteMutation.mutate(blogToDelete);
    setBlogToDelete(null);
  };


  return (
    <div>
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Blog management
            </h1>
            <div className="flex items-center space-x-2 text-sm">
              <Link
                href="/dashboard"
                className="text-gray-500 text-base hover:text-gray-700 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-gray-400">›</span>
              <span className="text-gray-500 text-base">Blog management</span>
              <span className="text-gray-400">›</span>
              <span className="text-gray-500 text-base">List</span>
            </div>
          </div>

          <Button
            size="sm"
            className="bg-[#797068] hover:bg-[#3a3129] text-white text-base h-[50px] px-6"
          >
            <Link href="/dashboard/blog/add" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Blog
            </Link>
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-left py-4 font-bold text-[#131313] text-base uppercase w-80">
                  Blog Name
                </TableHead>
                <TableHead className="text-center py-4 font-bold text-[#131313] text-base uppercase w-24">
                  Added
                </TableHead>
                <TableHead className="text-center py-4 font-bold text-[#131313] text-base uppercase w-28">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading
                ? // Skeleton Loader
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow
                    key={idx}
                    className="animate-pulse border-b border-gray-200"
                  >
                    {/* Blog Thumbnail + Title */}
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 bg-gray-300 rounded-lg"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 w-32 bg-gray-300 rounded"></div>
                          <div className="h-3 w-24 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Created At */}
                    <TableCell className="text-center px-4 py-4">
                      <div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center px-4 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <div className="h-8 w-8 bg-gray-300 rounded"></div>
                        <div className="h-8 w-8 bg-gray-300 rounded"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
                : blogs.length > 0
                  ? blogs.map((blog) => (
                    <TableRow key={blog._id}>
                      {/* Blog Title + Thumbnail */}
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 ">
                            <Image
                              src={blog.thumbnail}
                              alt={blog.title.slice(0, 10)}
                              width={100}
                              height={100}
                              className="rounded-lg w-16 h-16 object-cover border border-gray-200"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-[#272727] text-sm mb-1 truncate">
                              {blog.title}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Created At */}
                      <TableCell className="text-center px-4 py-4">
                        <span className="text-base font-medium">
                          {new Date(blog.createdAt).toLocaleString()}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-center px-4 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <Link href={`/dashboard/blog/edit/${blog._id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
                              title="Edit Blog"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                            title="Delete Blog"
                            onClick={() => confirmDelete(blog._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                  : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6">
                        No blogs found
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>

          </Table>
        </div>

        {/* Pagination */}
        {/* {meta && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
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
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={meta.page === 1}
                className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
              >
                ‹
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    variant={meta.page === page ? "default" : "outline"}
                    className={`h-9 w-9 p-0 ${meta.page === page
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
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={meta.page === totalPages}
                className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
              >
                ›
              </Button>
            </div>
          </div>
        )} */}


        {/* Pagination */}
{meta && meta.total > 10 && (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4  border-t border-gray-200">
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
        onClick={() => setCurrentPage((p) => p - 1)}
        disabled={meta.page === 1}
        className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
      >
        <ChevronLeft/>
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          size="sm"
          onClick={() => setCurrentPage(page)}
          variant={meta.page === page ? "default" : "outline"}
          className={`h-9 w-9 p-0 ${
            meta.page === page
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
        onClick={() => setCurrentPage((p) => p + 1)}
        disabled={meta.page === totalPages}
        className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
      >
        <ChevronRight/>
      </Button>
    </div>
  </div>
)}

      </div>
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        title={`Delete Blog ${blogDeleteMutation.isPending ? "..." : ""}`}
        description="Are you sure you want to delete this blog? This action cannot be undone."
        confirmText={blogDeleteMutation.isPending ? "Deleting..." : "Delete"}
        cancelText="Cancel"
      />
    </div>
  );
};

export default BlogList;
