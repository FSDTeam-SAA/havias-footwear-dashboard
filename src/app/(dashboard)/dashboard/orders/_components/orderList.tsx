"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const dummyOrders = [
  {
    id: 1,
    productName: "Wireless Headphones",
    productImage: "https://i.pravatar.cc/150?img=12",
    price: 120,
    deliveryDate: "2025-08-01",
  },
  {
    id: 2,
    productName: "Smartphone Pro Max",
    productImage: "https://i.pravatar.cc/150?img=20",
    price: 999,
    deliveryDate: "2025-08-12",
  },
  {
    id: 3,
    productName: "Gaming Laptop",
    productImage: "https://i.pravatar.cc/150?img=19",
    price: 1899,
    deliveryDate: "2025-08-20",
  },
  {
    id: 3,
    productName: "Gaming Laptop",
    productImage: "https://i.pravatar.cc/150?img=18",
    price: 1899,
    deliveryDate: "2025-08-20",
  },
  {
    id: 3,
    productName: "Gaming Laptop",
    productImage: "https://i.pravatar.cc/150?img=17",
    price: 1899,
    deliveryDate: "2025-08-20",
  },
  {
    id: 3,
    productName: "Gaming Laptop",
    productImage: "https://i.pravatar.cc/150?img=16",
    price: 1899,
    deliveryDate: "2025-08-20",
  },
  {
    id: 3,
    productName: "Gaming Laptop",
    productImage: "https://i.pravatar.cc/150?img=15",
    price: 1899,
    deliveryDate: "2025-08-20",
  },

];

type Order = {
  id: number;
  productName: string;
  productImage: string;
  price: number;
  deliveryDate: string;
};

const OrderList = () => {
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const totalPages = Math.ceil(dummyOrders.length / itemsPerPage);
  const paginatedOrders = dummyOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>

      {/* ✅ Table */}
      <div className="w-full mt-6">
        <div className="overflow-x-auto">
          <Table className="w-full ">
            <TableHeader className="">
              <TableRow className="">
                <TableHead className=" py-4 font-bold text-[20px] text-[#1C2228] text-sm uppercase tracking-wide w-60">
                  Product
                </TableHead>
                <TableHead className=" py-4 font-bold text-[20px] text-[#1C2228] text-sm uppercase tracking-wide w-32">
                  Price
                </TableHead>
                <TableHead className=" py-4 font-bold text-[20px] text-[#1C2228] text-sm uppercase tracking-wide w-40">
                  Delivery Date
                </TableHead>
                {/* <TableHead className="text-center py-4 font-semibold text-[#1C2228] text-sm uppercase tracking-wide w-32">
                  Action
                </TableHead> */}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id}>


                  <TableCell className="py-4  flex  ">
                    <div className="flex  gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={order.productImage} alt={order.productName} />
                        <AvatarFallback>
                          {order.productName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-[#595959] text-[16px] font-medium">
                        {order.productName.slice(0, 10)}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className=" text-sm font-medium text-[#1C2228]">
                    ${order.price}
                  </TableCell>

                  {/* ✅ Delivery Date */}
                  <TableCell className=" text-sm font-medium text-[#595959]">
                    {order.deliveryDate}
                  </TableCell>

                  {/* ✅ Action */}
                  {/* <TableCell className="text-center px-4 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ✅ Pagination */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center px-6 py-4 bg-gray-50 border-t border-gray-200 gap-4">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, dummyOrders.length)}
            </span>{" "}
            of <span className="font-medium">{dummyOrders.length}</span> results
          </p>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* ✅ Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription>
                  Full information about this order
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-4 py-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedOrder.productImage}
                    alt={selectedOrder.productName}
                  />
                  <AvatarFallback>
                    {selectedOrder.productName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{selectedOrder.productName}</p>
                  <p className="text-sm text-gray-500">
                    Order ID: {selectedOrder.id}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Price:</span> ${selectedOrder.price}
                </p>
                <p>
                  <span className="font-medium">Delivery Date:</span>{" "}
                  {selectedOrder.deliveryDate}
                </p>
              </div>

              <DialogFooter>
                <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderList;
