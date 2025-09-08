"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import categoryImage from "@/public/images/product.png";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { BlogsResponse } from "../../../../../../types/blogDataType";
import { toast } from "sonner";
// Fixed and consistent dummy data
const dummyCategories = [
  {
    id: 1,
    productName: "Westwood Shirt Men's Black",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi diam lorem, mollis eget elit eu dolor.",
    image: categoryImage,
    date: "04/21/2025 03:18pm",
  },
  {
    id: 2,
    productName: "Westwood Shirt Men's Black",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi diam lorem, mollis eget elit eu dolor.",
    image: categoryImage,
    date: "04/21/2025 03:18pm",
  },
  {
    id: 3,
    productName: "Westwood Shirt Men's Black",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi diam lorem, mollis eget elit eu dolor.",
    image: categoryImage,
    date: "04/21/2025 03:18pm",
  },
  {
    id: 4,
    productName: "Westwood Shirt Men's Black",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi diam lorem, mollis eget elit eu dolor.",
    image: categoryImage,
    date: "04/21/2025 03:18pm",
  },
  {
    id: 5,
    productName: "Westwood Shirt Men's Black",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi diam lorem, mollis eget elit eu dolor.",
    image: categoryImage,
    date: "04/21/2025 03:18pm",
  },
  {
    id: 6,
    productName: "Westwood Shirt Men's Black",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi diam lorem, mollis eget elit eu dolor.",
    image: categoryImage,
    date: "04/21/2025 03:18pm",
  },
  {
    id: 7,
    productName: "Westwood Shirt Men's Black",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi diam lorem, mollis eget elit eu dolor.",
    image: categoryImage,
    date: "04/21/2025 03:18pm",
  },
];

const BlogList = () => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dummyCategories.length / itemsPerPage);
  const session = useSession();

  const token = (session?.data?.user as { accessToken: string })?.accessToken;


  const { data, isLoading } = useQuery<BlogsResponse>({
    queryKey: ["blog"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/all-blogs`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    enabled: !!token,
  });

  console.log(isLoading)

  const blogs = data?.data || [];


  const blogDeleteMutation = useMutation({
    mutationFn: async (data: { id: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/${data.id}`,
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
      console.log(data);
      toast.success(data.message || "Blog deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete blog");
    },
  });


  const handleDelete = ({ id }: { id: string }) => {
    blogDeleteMutation.mutate({ id });
  }


  const paginatedCategories = blogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  return (
    <div className="">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-7">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Blog management</h1>
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

          <div className="flex items-center space-x-3">
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
      </div>

      {/* Table Section */}
      <div className="w-full">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b bo rder-gray-200">
                <TableHead className="text-left py-4 font-bold text-[#131313] text-base uppercase leading-[120%] w-80">
                  Blog Name
                </TableHead>
                <TableHead className="text-center py-4 font-bold text-[#131313] text-base uppercase leading-[120%] w-24">
                  Added
                </TableHead>
                <TableHead className="text-center py-4 font-bold text-[#131313] text-base uppercase leading-[120%] w-28">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedCategories.map((blog) => (
                <TableRow key={blog._id} className="">
                  {/* Product Name Column */}
                  <TableCell className=" py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={blog.thumbnail}
                          alt={blog.title.slice(0, 10)}
                          width={100}
                          height={100}
                          className="rounded-lg object-cover border border-gray-200"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#272727] text-sm mb-1 truncate">
                          {blog.title}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Product ID Column */}
                  <TableCell className="text-center px-4 py-4">
                    <span className="text-base font-medium text-[]  px-2 py-1 rounded">
                      {blog.createdAt}
                    </span>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-center px-4 py-4">
                    <div className="flex justify-center items-center gap-2">
                      <Link href={`/dashboard/blog/edit/${blog._id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600 transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                        title="Delete Product"
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to delete "${blog._id}"?`
                            )
                          ) {
                            // Handle delete logic here
                            handleDelete({ id: blog._id });
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
                {Math.min(currentPage * itemsPerPage, dummyCategories.length)}
              </span>{" "}
              of <span className="font-medium">{dummyCategories.length}</span>{" "}
              results
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
    </div>
  );
};

export default BlogList;
