"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorsResponse, Color } from "../../../../../../types/colorDataTypes";
import Link from "next/link";
import { toast } from "sonner";

const ColorList = () => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery<ColorsResponse>({
    queryKey: ["color", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/color?page=${currentPage}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch colors");
      return res.json();
    },
    enabled: !!token,
  });

  // 🔹 Delete mutation
  const { mutate: deleteColor } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/color/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete color");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Color deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["color"] });
    },
    onError: (err: unknown) => {
      console.error(err);
      toast.error("Failed to delete color. Please try again.");
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const colors: Color[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;

  return (
    <div className="">
      <div className="border-b border-gray-200 pb-7">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Colors List
            </h1>
            <div className="flex items-center space-x-2 text-sm">
              <Link
                href="/dashboard"
                className="text-gray-500 text-base hover:text-gray-700 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-gray-400">›</span>
              <span className="text-gray-500 text-base">Colors</span>
              <span className="text-gray-400">›</span>
              <span className="text-gray-500 text-base">List</span>
            </div>
          </div>

          <Button
            size="sm"
            className="bg-[#797068] hover:bg-[#3a3129] text-white text-base h-[50px] px-6"
          >
            <Link
              href="/dashboard/colors/color-add"
              className="flex items-center"
            >
              <Plus className="!h-5 !w-5 mr-2" />
              Add Color
            </Link>
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[18px] font-medium">Name</TableHead>
            <TableHead className="text-[18px] font-medium">Code</TableHead>
            <TableHead className="text-[18px] font-medium">Date</TableHead>
            <TableHead className="text-right text-[18px] font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colors.map((color) => (
            <TableRow key={color._id} className="items-center">
              <TableCell className="py-6">{color.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded border"
                    style={{ backgroundColor: color.code }}
                  />
                  <span>{color.code}</span>
                </div>
              </TableCell>
              <TableCell>
                {new Date(color.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="flex flex-col items-end justify-center gap-3 h-[70px]">
                <div className="space-x-5">
                  <button>
                    <Link
                      href={`/dashboard/colors/${color._id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </Link>
                  </button>
                  <button
                    onClick={() => deleteColor(color._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
              ‹
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
              ›
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorList;
