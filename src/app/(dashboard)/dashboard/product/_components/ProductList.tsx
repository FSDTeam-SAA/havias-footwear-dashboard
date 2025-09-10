// // "use client";

// // import React, { useState } from "react";
// // import Image from "next/image";
// // import { Edit, Plus, Trash2 } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import Link from "next/link";

// // import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// // import { useSession } from "next-auth/react";
// // import { ProductResponse, Product } from "../../../../../../types/productDataType";
// // import { toast } from "sonner";
// // import { Input } from "@/components/ui/input";

// // const ProductList = () => {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 10; // backend already supports this
// //   const sesion = useSession();
// //   const token = (sesion?.data?.user as { accessToken: string })?.accessToken;
// //   const queryClient = useQueryClient();
// //   // Fetch products with pagination
// //   const { data, isLoading, isError } = useQuery<ProductResponse>({
// //     queryKey: ["products", currentPage, searchTerm],
// //     queryFn: async () => {
// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/all-products?searchTerm=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=${itemsPerPage}`,
// //         {
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );
// //       if (!res.ok) throw new Error("Failed to fetch products");
// //       return res.json();
// //     },
// //     enabled: !!token,
// //   });

// //   const products = data?.data ?? [];
// //   const meta = data?.meta;

// //   const handlePageChange = (page: number) => {
// //     if (page >= 1 && page <= (meta?.totalPages ?? 1)) {
// //       setCurrentPage(page);
// //     }
// //   };

// //   const getQuantityDisplay = (quantity: number) => {
// //     return (
// //       <span
// //         className={`text-sm font-medium ${quantity === 0
// //           ? "text-red-600"
// //           : quantity < 50
// //             ? "text-orange-600"
// //             : "text-gray-900"
// //           }`}
// //       >
// //         {quantity}
// //       </span>
// //     );
// //   };


// //   const productDeleteMutation = useMutation({
// //     mutationFn: async (data: { id: string }) => {
// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${data.id}`,
// //         {
// //           method: "DELETE",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       if (!res.ok) {
// //         const errorData = await res.json();
// //         throw new Error(errorData.message || "Failed to delete products");
// //       }

// //       return res.json();
// //     },
// //     onSuccess: (data) => {
// //       queryClient.invalidateQueries({ queryKey: ["products"] });
// //       toast.success(data.message || "Product deleted successfully");
// //     },
// //     onError: (error) => {
// //       toast.error(error.message || "Product to delete products");
// //     },
// //   });

// //   const handleDelete = ({ id }: { id: string }) => {
// //     productDeleteMutation.mutate({ id });
// //   };


// //   return (
// //     <div>
// //       {/* Header Section */}
// //       <div className="border-b border-gray-200 pb-7">
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-900 mb-1">Products</h1>
// //             <div className="flex items-center space-x-2 text-sm">
// //               <Link
// //                 href="/dashboard"
// //                 className="text-gray-500 text-base hover:text-gray-700 transition-colors"
// //               >
// //                 Dashboard
// //               </Link>
// //               <span className="text-gray-400">›</span>
// //               <span className="text-gray-500 text-base">Products</span>
// //             </div>
// //           </div>

// //           <div className="flex items-center space-x-3 w-full sm:w-auto">
// //             <Input
// //               placeholder="Search products..."
// //               value={searchTerm}
// //               onChange={(e) => {
// //                 setSearchTerm(e.target.value);
// //                 setCurrentPage(1);
// //               }}
// //               className="h-[50px] border border-[#0000001A] w-full sm:w-64"
// //             />

// //             <Button
// //               size="sm"
// //               className="bg-[#797068] hover:bg-[#3a3129] text-white text-base h-[50px] px-6"
// //             >
// //               <Link href="/dashboard/product/add" className="flex items-center">
// //                 <Plus className="h-4 w-4 mr-2" />
// //                 Add resource
// //               </Link>
// //             </Button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Table Section */}
// //       <div className="w-full mt-6">
// //         {isLoading ? (
// //           <p className="text-center py-10">Loading products...</p>
// //         ) : isError ? (
// //           <p className="text-center py-10 text-red-500">Failed to load products</p>
// //         ) : (
// //           <div className="overflow-x-auto">
// //             <Table className="w-full">
// //               <TableHeader>
// //                 <TableRow className="border-b border-gray-200">
// //                   <TableHead className="w-80">Product Name</TableHead>
// //                   <TableHead className="text-center w-24">ID</TableHead>
// //                   <TableHead className="text-center w-24">MSRP</TableHead>
// //                   <TableHead className="text-center w-20">MOQ</TableHead>
// //                   <TableHead className="text-center w-24">Unit Price</TableHead>
// //                   <TableHead className="text-center w-20">Quantity</TableHead>
// //                   <TableHead className="text-center w-40">Date Added</TableHead>
// //                   <TableHead className="text-center w-28">Actions</TableHead>
// //                 </TableRow>
// //               </TableHeader>

// //               <TableBody>
// //                 {products.map((product: Product) => (
// //                   <TableRow key={product._id}>
// //                     {/* Product Name */}
// //                     <TableCell className="py-4">
// //                       <div className="flex items-center space-x-4">
// //                         <div className="flex-shrink-0">
// //                           <Image
// //                             src={product.images[0] || "/images/product.png"}
// //                             alt={product.title}
// //                             width={80}
// //                             height={80}
// //                             className="rounded-lg w-16 h-16 object-cover border border-gray-200"
// //                           />
// //                         </div>
// //                         <div className="min-w-0 flex-1">
// //                           <p className="font-semibold text-gray-900 text-sm mb-1 truncate">
// //                             {product.title}
// //                           </p>
// //                         </div>
// //                       </div>
// //                     </TableCell>

// //                     {/* ID */}
// //                     <TableCell className="text-center px-4 py-4">
// //                       #{product._id.slice(-6)}
// //                     </TableCell>

// //                     {/* MSRP */}
// //                     <TableCell className="text-center px-4 py-4">
// //                       ${product.msrp}
// //                     </TableCell>

// //                     {/* MOQ */}
// //                     <TableCell className="text-center px-4 py-4">
// //                       {product.moq}
// //                     </TableCell>

// //                     {/* Unit Price */}
// //                     <TableCell className="text-center px-4 py-4">
// //                       ${product.unitPrice}
// //                     </TableCell>

// //                     {/* Quantity */}
// //                     <TableCell className="text-center px-4 py-4">
// //                       {getQuantityDisplay(product.quantity)}
// //                     </TableCell>

// //                     {/* Date Added */}
// //                     <TableCell className="text-center px-4 py-4">
// //                       <div className="text-xs">
// //                         <div className="text-base font-normal text-[#424242] px-2 py-1">
// //                           {new Date(product.createdAt).toLocaleDateString()}
// //                         </div>
// //                         <div className="text-gray-500">
// //                           {new Date(product.createdAt).toLocaleTimeString()}
// //                         </div>
// //                       </div>
// //                     </TableCell>

// //                     {/* Actions */}
// //                     <TableCell className="text-center px-4 py-4">
// //                       <div className="flex justify-center items-center gap-2">
// //                         <Link href={`/dashboard/product/edit/${product._id}`}>
// //                           <Button
// //                             variant="ghost"
// //                             size="sm"
// //                             className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
// //                             title="Edit Product"
// //                           >
// //                             <Edit className="w-4 h-4" />
// //                           </Button>
// //                         </Link>
// //                         <Button
// //                           variant="ghost"
// //                           size="sm"
// //                           className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
// //                           title="Delete Product"
// //                           onClick={() => {
// //                             handleDelete({ id: product._id });
// //                           }}
// //                         >
// //                           <Trash2 className="w-4 h-4" />
// //                         </Button>
// //                       </div>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //           </div>
// //         )}

// //         {/* Pagination */}
// //         {meta && (
// //           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-gray-200">
// //             <div className="mb-2 sm:mb-0">
// //               <p className="text-sm text-gray-600">
// //                 Showing{" "}
// //                 <span className="font-medium">
// //                   {(meta.page - 1) * meta.limit + 1}
// //                 </span>{" "}
// //                 to{" "}
// //                 <span className="font-medium">
// //                   {Math.min(meta.page * meta.limit, meta.total)}
// //                 </span>{" "}
// //                 of <span className="font-medium">{meta.total}</span> results
// //               </p>
// //             </div>

// //             <div className="flex items-center space-x-2">
// //               <Button
// //                 variant="outline"
// //                 size="sm"
// //                 onClick={() => handlePageChange(currentPage - 1)}
// //                 disabled={currentPage === 1}
// //                 className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
// //               >
// //                 ‹
// //               </Button>

// //               {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
// //                 (page) => (
// //                   <Button
// //                     key={page}
// //                     size="sm"
// //                     onClick={() => handlePageChange(page)}
// //                     variant={currentPage === page ? "default" : "outline"}
// //                     className={`h-9 w-9 p-0 ${currentPage === page
// //                       ? "bg-gray-800 text-white hover:bg-gray-900"
// //                       : "border-gray-300 hover:bg-gray-50"
// //                       }`}
// //                   >
// //                     {page}
// //                   </Button>
// //                 )
// //               )}

// //               <Button
// //                 variant="outline"
// //                 size="sm"
// //                 onClick={() => handlePageChange(currentPage + 1)}
// //                 disabled={currentPage === meta.totalPages}
// //                 className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
// //               >
// //                 ›
// //               </Button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductList;


// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { Edit, Plus, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import Link from "next/link";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import { ProductResponse, Product } from "../../../../../../types/productDataType";
// import { toast } from "sonner";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";

// const ProductList = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const sesion = useSession();
//   const token = (sesion?.data?.user as { accessToken: string })?.accessToken;
//   const queryClient = useQueryClient();

//   const { data, isLoading, isError } = useQuery<ProductResponse>({
//     queryKey: ["products", currentPage, searchTerm],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/all-products?searchTerm=${encodeURIComponent(
//           searchTerm
//         )}&page=${currentPage}&limit=${itemsPerPage}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (!res.ok) throw new Error("Failed to fetch products");
//       return res.json();
//     },
//     enabled: !!token,
//   });

//   const products = data?.data ?? [];
//   const meta = data?.meta;

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= (meta?.totalPages ?? 1)) {
//       setCurrentPage(page);
//     }
//   };

//   const getQuantityDisplay = (quantity: number) => {
//     return (
//       <span
//         className={`text-sm font-medium ${
//           quantity === 0
//             ? "text-red-600"
//             : quantity < 50
//             ? "text-orange-600"
//             : "text-gray-900"
//         }`}
//       >
//         {quantity}
//       </span>
//     );
//   };

//   const productDeleteMutation = useMutation({
//     mutationFn: async (data: { id: string }) => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${data.id}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to delete products");
//       }

//       return res.json();
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//       toast.success(data.message || "Product deleted successfully");
//     },
//     onError: (error) => {
//       toast.error(error.message || "Failed to delete product");
//     },
//   });

//   const handleDelete = ({ id }: { id: string }) => {
//     productDeleteMutation.mutate({ id });
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="border-b border-gray-200 pb-7">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-1">Products</h1>
//             <div className="flex items-center space-x-2 text-sm">
//               <Link
//                 href="/dashboard"
//                 className="text-gray-500 text-base hover:text-gray-700 transition-colors"
//               >
//                 Dashboard
//               </Link>
//               <span className="text-gray-400">›</span>
//               <span className="text-gray-500 text-base">Products</span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-3 w-full sm:w-auto">
//             <Input
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="h-[50px] border border-[#0000001A] w-full sm:w-64"
//             />
//             <Button
//               size="sm"
//               className="bg-[#797068] hover:bg-[#3a3129] text-white text-base h-[50px] px-6"
//             >
//               <Link href="/dashboard/product/add" className="flex items-center">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add resource
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="w-full mt-6">
//         {isLoading ? (
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Product Name</TableHead>
//                   <TableHead>ID</TableHead>
//                   <TableHead>MSRP</TableHead>
//                   <TableHead>MOQ</TableHead>
//                   <TableHead>Unit Price</TableHead>
//                   <TableHead>Quantity</TableHead>
//                   <TableHead>Date Added</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <TableRow key={i}>
//                     <TableCell>
//                       <div className="flex items-center space-x-4">
//                         <Skeleton className="w-16 h-16 rounded-lg" />
//                         <div className="flex flex-col space-y-2">
//                           <Skeleton className="h-4 w-40" />
//                           <Skeleton className="h-4 w-28" />
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Skeleton className="h-4 w-12 mx-auto" />
//                     </TableCell>
//                     <TableCell>
//                       <Skeleton className="h-4 w-16 mx-auto" />
//                     </TableCell>
//                     <TableCell>
//                       <Skeleton className="h-4 w-12 mx-auto" />
//                     </TableCell>
//                     <TableCell>
//                       <Skeleton className="h-4 w-16 mx-auto" />
//                     </TableCell>
//                     <TableCell>
//                       <Skeleton className="h-4 w-12 mx-auto" />
//                     </TableCell>
//                     <TableCell>
//                       <Skeleton className="h-4 w-24 mx-auto" />
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex justify-center gap-2">
//                         <Skeleton className="h-8 w-8 rounded-md" />
//                         <Skeleton className="h-8 w-8 rounded-md" />
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         ) : isError ? (
//           <p className="text-center py-10 text-red-500">
//             Failed to load products
//           </p>
//         ) : (
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="border-b border-gray-200">
//                   <TableHead className="w-80">Product Name</TableHead>
//                   <TableHead className="text-center w-24">ID</TableHead>
//                   <TableHead className="text-center w-24">MSRP</TableHead>
//                   <TableHead className="text-center w-20">MOQ</TableHead>
//                   <TableHead className="text-center w-24">Unit Price</TableHead>
//                   <TableHead className="text-center w-20">Quantity</TableHead>
//                   <TableHead className="text-center w-40">Date Added</TableHead>
//                   <TableHead className="text-center w-28">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {products.map((product: Product) => (
//                   <TableRow key={product._id}>
//                     <TableCell className="py-4">
//                       <div className="flex items-center space-x-4">
//                         <Image
//                           src={product.images[0] || "/images/product.png"}
//                           alt={product.title}
//                           width={80}
//                           height={80}
//                           className="rounded-lg w-16 h-16 object-cover border border-gray-200"
//                         />
//                         <div className="min-w-0 flex-1">
//                           <p className="font-semibold text-gray-900 text-sm mb-1 truncate">
//                             {product.title}
//                           </p>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-center px-4 py-4">
//                       #{product._id.slice(-6)}
//                     </TableCell>
//                     <TableCell className="text-center px-4 py-4">
//                       ${product.msrp}
//                     </TableCell>
//                     <TableCell className="text-center px-4 py-4">
//                       {product.moq}
//                     </TableCell>
//                     <TableCell className="text-center px-4 py-4">
//                       ${product.unitPrice}
//                     </TableCell>
//                     <TableCell className="text-center px-4 py-4">
//                       {getQuantityDisplay(product.quantity)}
//                     </TableCell>
//                     <TableCell className="text-center px-4 py-4">
//                       <div className="text-xs">
//                         <div className="text-base font-normal text-[#424242] px-2 py-1">
//                           {new Date(product.createdAt).toLocaleDateString()}
//                         </div>
//                         <div className="text-gray-500">
//                           {new Date(product.createdAt).toLocaleTimeString()}
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-center px-4 py-4">
//                       <div className="flex justify-center items-center gap-2">
//                         <Link href={`/dashboard/product/edit/${product._id}`}>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </Button>
//                         </Link>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
//                           onClick={() => handleDelete({ id: product._id })}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         )}

//         {/* Pagination */}
//         {meta && !isLoading && (
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-gray-200">
//             <div className="mb-2 sm:mb-0">
//               <p className="text-sm text-gray-600">
//                 Showing{" "}
//                 <span className="font-medium">
//                   {(meta.page - 1) * meta.limit + 1}
//                 </span>{" "}
//                 to{" "}
//                 <span className="font-medium">
//                   {Math.min(meta.page * meta.limit, meta.total)}
//                 </span>{" "}
//                 of <span className="font-medium">{meta.total}</span> results
//               </p>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
//               >
//                 ‹
//               </Button>
//               {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <Button
//                     key={page}
//                     size="sm"
//                     onClick={() => handlePageChange(page)}
//                     variant={currentPage === page ? "default" : "outline"}
//                     className={`h-9 w-9 p-0 ${
//                       currentPage === page
//                         ? "bg-gray-800 text-white hover:bg-gray-900"
//                         : "border-gray-300 hover:bg-gray-50"
//                     }`}
//                   >
//                     {page}
//                   </Button>
//                 )
//               )}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === meta.totalPages}
//                 className="h-9 w-9 p-0 border-gray-300 disabled:opacity-50"
//               >
//                 ›
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductList;

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Edit, Plus, Trash2 } from "lucide-react";
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
import { ProductResponse, Product } from "../../../../../../types/productDataType";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const sesion = useSession();
  const token = (sesion?.data?.user as { accessToken: string })?.accessToken;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<ProductResponse>({
    queryKey: ["products", currentPage, searchTerm],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/all-products?searchTerm=${encodeURIComponent(
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
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(data.message || "Product deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  const handleDelete = ({ id }: { id: string }) => {
    productDeleteMutation.mutate({ id });
  };

  return (
    <div>
      {/* Header */}
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

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="h-[50px] border border-[#0000001A] w-full sm:w-64"
            />
            <Button
              size="sm"
              className="bg-[#797068] hover:bg-[#3a3129] text-white text-base h-[50px] px-6"
            >
              <Link href="/dashboard/product/add" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add resource
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full mt-6">
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
                  <TableRow key={i}>
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
                <TableRow className="border-b border-gray-200">
                  <TableHead className="w-80">Product Name</TableHead>
                  <TableHead className="text-center w-24">ID</TableHead>
                  <TableHead className="text-center w-24">MSRP</TableHead>
                  <TableHead className="text-center w-20">MOQ</TableHead>
                  <TableHead className="text-center w-24">Unit Price</TableHead>
                  <TableHead className="text-center w-20">Quantity</TableHead>
                  <TableHead className="text-center w-40">Date Added</TableHead>
                  <TableHead className="text-center w-28">Actions</TableHead>
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
                          <p className="font-semibold text-gray-900 text-sm mb-1 truncate">
                            {product.title}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center px-4 py-4">
                      #{product._id.slice(-6)}
                    </TableCell>
                    <TableCell className="text-center px-4 py-4">
                      ${product.msrp}
                    </TableCell>
                    <TableCell className="text-center px-4 py-4">
                      {product.moq}
                    </TableCell>
                    <TableCell className="text-center px-4 py-4">
                      ${product.unitPrice}
                    </TableCell>
                    <TableCell className="text-center px-4 py-4">
                      {getQuantityDisplay(product.quantity)}
                    </TableCell>
                    <TableCell className="text-center px-4 py-4">
                      <div className="text-xs">
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
                          onClick={() => handleDelete({ id: product._id })}
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
        {meta && !isLoading && (
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
                ›
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
