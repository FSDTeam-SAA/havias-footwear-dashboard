

"use client";

import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import Title from "../../_components/Title";

// Dummy category data
const dummyCategories = [
  { id: 1, name: "Men's Clothing", date: "04/21/2025 03:18pm" },
  { id: 2, name: "Women's Clothing", date: "04/20/2025 02:30pm" },
  { id: 3, name: "Accessories", date: "04/19/2025 01:15pm" },
  { id: 4, name: "Footwear", date: "04/18/2025 04:45pm" },
  { id: 5, name: "Electronics", date: "04/17/2025 11:20am" },
  { id: 6, name: "Home & Garden", date: "04/16/2025 09:30am" },
  { id: 7, name: "Sports", date: "04/15/2025 03:45pm" },
];

const CategoryList = () => {
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dummyCategories.length / itemsPerPage);
  const paginatedCategories = dummyCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="px-6 py-5 ">
        <div className="flex justify-between w-full">
          <Title title='Categories List' active='Dashboard > Categories > List' />
          <Link href={"/categories/add-categories"}>
            <Button size="sm" className="bg-[#797068] hover:bg-[#3a3129] text-white text-base h-[50px] px-6">
              Add Category
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-left px-6 py-4 font-medium text-[18px] text-[#1C2228]  uppercase tracking-wide w-80">
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
            {paginatedCategories.map((category) => (
              <TableRow key={category.id}>
                {/* Name */}
                <TableCell className="px-6 py-4">
                  <span className="text-[16px] font-normal text-[#595959]">{category.name}</span>
                </TableCell>

                {/* Date */}
                <TableCell className="text-center px-4 py-4">
                  <div className="text-xs">
                    <div className="text-[16px] font-normal text-[#595959]">{category.date.split(" ")[0]}</div>
                    {/* <div className="text-gray-500">{category.date.split(" ")[1]}</div> */}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-center px-4 py-4">
                  <div className="flex justify-center items-center gap-2">
                    <Link href={`/categories/edit/${category.id}`}>
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
                        if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
                 
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
            <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>{" "}
            to{" "}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, dummyCategories.length)}</span>{" "}
            of <span className="font-medium">{dummyCategories.length}</span> results
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
