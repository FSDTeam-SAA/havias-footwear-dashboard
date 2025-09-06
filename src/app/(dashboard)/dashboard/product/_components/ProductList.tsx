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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Fixed and consistent dummy data
const dummyCategories = [
  {
    id: 1,
    productName: "Shirt-Black",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi diam lorem, mollis eget elit eu dolor.",
    image: categoryImage,
    productId: "1140",
    msrp: "$12.00",
    moq: "50",
    unitPrice: "$8.00",
    packPrice: "$0.25",
    quantity: "100",
    date: "04/21/2025 03:18pm",
    status: "In Stock",
  },
  {
    id: 2,
    productName: "Shirt-Black",
    description:
      "Premium quality denim jacket with vintage styling and modern comfort.",
    image: categoryImage,
    productId: "1141",
    msrp: "$89.99",
    moq: "25",
    unitPrice: "$65.00",
    packPrice: "$2.50",
    quantity: "75",
    date: "04/20/2025 02:30pm",
    status: "Out Of Stock",
  },
  {
    id: 3,
    productName: "Shirt-Black",
    description:
      "Soft cotton t-shirt with breathable fabric and comfortable fit.",
    image: categoryImage,
    productId: "1142",
    msrp: "$24.99",
    moq: "100",
    unitPrice: "$18.00",
    packPrice: "$0.75",
    quantity: "200",
    date: "04/19/2025 01:15pm",
    status: "In Stock",
  },
  {
    id: 4,
    productName: "Shirt-Black",
    description: "Cozy wool blend sweater perfect for cold weather styling.",
    image: categoryImage,
    productId: "1143",
    msrp: "$79.99",
    moq: "30",
    unitPrice: "$55.00",
    packPrice: "$2.00",
    quantity: "45",
    date: "04/18/2025 04:45pm",
    status: "In Stock",
  },
  {
    id: 5,
    productName: "Shirt-Black",
    description:
      "Versatile chino pants suitable for both casual and semi-formal occasions.",
    image: categoryImage,
    productId: "1144",
    msrp: "$49.99",
    moq: "40",
    unitPrice: "$35.00",
    packPrice: "$1.25",
    quantity: "120",
    date: "04/17/2025 11:20am",
    status: "In Stock",
  },
  {
    id: 6,
    productName: "Shirt-Black",
    description: "High-performance shorts with moisture-wicking technology.",
    image: categoryImage,
    productId: "1145",
    msrp: "$34.99",
    moq: "60",
    unitPrice: "$24.00",
    packPrice: "$0.85",
    quantity: "0",
    date: "04/16/2025 09:30am",
    status: "Out Of Stock",
  },
  {
    id: 7,
    productName: "Shirt-Black",
    description:
      "Crisp formal shirt with professional styling and wrinkle-resistant fabric.",
    image: categoryImage,
    productId: "1146",
    msrp: "$59.99",
    moq: "20",
    unitPrice: "$42.00",
    packPrice: "$1.50",
    quantity: "80",
    date: "04/15/2025 03:45pm",
    status: "In Stock",
  },
];

const ProductList = () => {
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

  const getQuantityDisplay = (quantity: string) => {
    const qty = parseInt(quantity);
    return (
      <span
        className={`text-sm font-medium ${
          qty === 0
            ? "text-red-600"
            : qty < 50
            ? "text-orange-600"
            : "text-gray-900"
        }`}
      >
        {quantity}
      </span>
    );
  };

  return (
    <div className="">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-7">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Products</h1>
            <div className="flex items-center space-x-2 text-sm">
              <Link
                href="/dashboard"
                className="text-gray-500 text-base hover:text-gray-700 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-gray-400">›</span>
              <span className="text-gray-500 text-base">Products</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Select>
              <SelectTrigger className="w-[180px] h-[50px] border border-[#797068]">
                <SelectValue placeholder="Select One" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="bg-[#797068] hover:bg-[#3a3129] text-white text-base h-[50px] px-6"
            >
              <Link href="/product/add" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add resource
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
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-left py-4 font-bold text-black text-base uppercase leading-[120%] w-80">
                  Product Name
                </TableHead>
                <TableHead className="text-center py-4 font-bold text-black text-base uppercase leading-[120%] w-24">
                  ID
                </TableHead>
                <TableHead className="text-center py-4 font-bold text-black text-base uppercase leading-[120%] w-24">
                  MSRP
                </TableHead>
                <TableHead className="text-center py-4 font-bold text-black text-base uppercase leading-[120%] w-20">
                  MOQ
                </TableHead>
                <TableHead className="text-center py-4 font-bold text-black text-base uppercase leading-[120%] w-24">
                  Unit Price
                </TableHead>
                <TableHead className="text-center py-4 font-bold text-black text-base uppercase leading-[120%] w-24">
                  Pack Price
                </TableHead>
                <TableHead className="text-center py-4 font-bold text-black text-base uppercase leading-[120%] w-20">
                  Quantity
                </TableHead>
                <TableHead className="text-center py-4 font-bold text-black text-base uppercase leading-[120%] w-40">
                  Date Added
                </TableHead>
                <TableHead className="text-center py-4 font-bold text-black text-base uppercase leading-[120%] w-28">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedCategories.map((product) => (
                <TableRow key={product.id} className="">
                  {/* Product Name Column */}
                  <TableCell className=" py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.productName}
                          width={100}
                          height={100}
                          className="rounded-lg object-cover border border-gray-200"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm mb-1 truncate">
                          {product.productName}
                        </p>
                        {/* <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p> */}
                      </div>
                    </div>
                  </TableCell>

                  {/* Product ID Column */}
                  <TableCell className="text-center px-4 py-4">
                    <span className="text-base font-normal text-[#424242] px-2 py-1">
                      #{product.productId}
                    </span>
                  </TableCell>

                  {/* MSRP Column */}
                  <TableCell className="text-center px-4 py-4">
                    <span className="text-base font-normal text-[#424242] px-2 py-1">
                      {product.msrp}
                    </span>
                  </TableCell>

                  {/* MOQ Column */}
                  <TableCell className="text-center px-4 py-4">
                    <span className="text-base font-normal text-[#424242] px-2 py-1">
                      {product.moq}
                    </span>
                  </TableCell>

                  {/* Unit Price Column */}
                  <TableCell className="text-center px-4 py-4">
                    <span className="text-base font-normal text-[#424242] px-2 py-1">
                      {product.unitPrice}
                    </span>
                  </TableCell>

                  {/* Pack Price Column */}
                  <TableCell className="text-center px-4 py-4">
                    <span className="text-base font-normal text-[#424242]">
                      {product.packPrice}
                    </span>
                  </TableCell>

                  {/* Quantity Column */}
                  <TableCell className="text-center px-4 py-4">
                    {getQuantityDisplay(product.quantity)}
                  </TableCell>

                  {/* Date Column */}
                  <TableCell className="text-center px-4 py-4">
                    <div className="text-xs">
                      <div className="text-base font-normal text-[#424242] px-2 py-1">
                        {product.date.split(" ")[0]}
                      </div>
                      <div className="text-gray-500">
                        {product.date.split(" ")[1]}
                      </div>
                    </div>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-center px-4 py-4">
                    <div className="flex justify-center items-center gap-2">
                      <Link href={`/product/edit/${product.id}`}>
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
                              `Are you sure you want to delete "${product.productName}"?`
                            )
                          ) {
                            // Handle delete logic here
                            console.log("Delete product:", product.id);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-gray-200">
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
              ›
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
