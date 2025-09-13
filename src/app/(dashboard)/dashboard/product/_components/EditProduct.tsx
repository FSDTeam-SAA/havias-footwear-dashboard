// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState, useEffect } from "react";
// import dynamic from "next/dynamic";
// import { z } from "zod";
// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent } from "@/components/ui/card";
// import { ChevronRight, Upload, ImageIcon, Loader2 } from "lucide-react";
// import Image from "next/image";
// import "react-quill/dist/quill.snow.css";
// import { TagsInput } from "@/components/ui/tagsInput";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";
// import { ColorsResponse } from "../../../../../../types/colorDataTypes";

// // React Quill Setup
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// const quillModules = {
//   toolbar: [
//     [{ header: [1, 2, false] }],
//     [{ font: [] }],
//     ["bold", "italic", "underline"],
//     [{ align: [] }],
//     [{ list: "ordered" }, { list: "bullet" }],
//     ["code-block"],
//   ],
// };
// const quillFormats = [
//   "header",
//   "font",
//   "bold",
//   "italic",
//   "underline",
//   "align",
//   "list",
//   "bullet",
//   "code-block",
// ];

// // Schema
// const formSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   msrp: z.string().optional(),
//   moq: z.string().optional(),
//   unitPrice: z.string().optional(),
//   packPrice: z.string().optional(),
//   quantity: z.string().optional(),
//   description: z.string().optional(),
//   // status: z.enum(["active", "deactive"]),
//   category: z.string().optional(),
//   productType: z.string().optional(),
//   subCategory: z.string().optional(),
//   brandName: z.string().optional(),
//   size: z.array(z.string()).optional(),
//   color: z.string().nonempty("Color is required"),
// });

// type FormData = z.infer<typeof formSchema>;

// export default function EditProduct({ id }: { id: string }) {
//   const [uploadedImages, setUploadedImages] = useState<string[]>([]);
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<any>(null);
//   const [productTypes, setProductTypes] = useState<string[]>([]);
//   const [subCategories, setSubCategories] = useState<any[]>([]);
//   const [removedImages, setRemovedImages] = useState<string[]>([]);
//   const [deactiveProductType, setDeactiveProductType] = useState(false);
//   const [deactiveSubCategory, setDeactiveSubCategory] = useState(false);

//   const session = useSession();
//   const token = (session?.data?.user as { accessToken: string })?.accessToken;
//   const queryClient = useQueryClient();

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       msrp: "",
//       moq: "",
//       unitPrice: "",
//       packPrice: "",
//       quantity: "",
//       description: "",
//       // status: "active",
//       category: "",
//       productType: "",
//       subCategory: "",
//       brandName: "",
//       size: [],
//       color: "",
//     },
//   });

//   // Fetch categories
//   const { data: categoriesData } = useQuery<any>({
//     queryKey: ["categories"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/all-categories?page=1&limit=50`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (!res.ok) throw new Error("Failed to fetch categories");
//       return res.json();
//     },
//     enabled: !!token,
//   });

//   // Fetch single product
//   const { data: product, isLoading: isProductLoading } = useQuery<any>({
//     queryKey: ["singleProduct", id],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (!res.ok) throw new Error("Failed to fetch product");
//       return res.json();
//     },
//     enabled: !!token && !!id,
//   });

//   // Fetch colors
//   const { data: colorsData } = useQuery<ColorsResponse>({
//     queryKey: ["colors"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/color?page=${1}&limit=${50}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (!res.ok) throw new Error("Failed to fetch colors");
//       return res.json();
//     },
//     enabled: !!token,
//   });

//   // Set form values and images when product and categories data are available
//   useEffect(() => {
//     if (product && categoriesData) {
//       const productData = product.data;

//       // Find category
//       const initialCategory = categoriesData.data.find(
//         (c: any) => c._id === productData.category?._id
//       );

//       if (initialCategory) {
//         setSelectedCategory(initialCategory);
//         setProductTypes(initialCategory.productType || []);
//       }
//       // Reset form after productTypes are set
//       form.reset({
//         title: productData.title || "",
//         msrp: productData.msrp?.toString() || "",
//         moq: productData.moq?.toString() || "",
//         unitPrice: productData.unitPrice?.toString() || "",
//         packPrice: productData.discountPrice?.toString() || "",
//         quantity: productData.quantity?.toString() || "",
//         description: productData.description || "",
//         brandName: productData.brand || "",
//         size: productData.sizes || [],
//         color: productData.colors?.[0]?._id || "",
//         category: productData.category?._id || "",
//         productType: productData.productType || "",
//         subCategory: productData.subCategory?._id || "",
//       });

//       // Set uploaded images
//       if (productData.images?.length > 0) {
//         setUploadedImages(productData.images);
//       }
//     }
//   }, [product, categoriesData, form, colorsData]);


//   // Fetch subcategories when selectedCategory changes
//   useEffect(() => {
//     if (!selectedCategory) return;

//     const types = selectedCategory.productType || [];
//     setProductTypes(types);
//     // setProductTypes(selectedCategory.productType || []);

//     const fetchSubCategories = async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-category/category/${selectedCategory._id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (!res.ok) {
//         // toast.error("Failed to fetch subcategories");
//         return;
//       }
//       const data = await res.json();
//       const subCats = data.data.subCategories || [];
//       setSubCategories(subCats);
//       // setSubCategories(data.data.subCategories || []);1

//       setDeactiveProductType(types.length === 0);
//       setDeactiveSubCategory(subCats.length === 0);
//     };

//     fetchSubCategories();
//   }, [selectedCategory, token]);

//   // Image Upload Handler
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files ?? []);
//     setUploadedFiles((prev) => [...prev, ...files]);

//     const previewUrls = files.map((file) => URL.createObjectURL(file));
//     setUploadedImages((prev) => [...prev, ...previewUrls]);
//   };

//   // Remove Image Handler
//   const handleRemoveImage = (image: string) => {
//     const isExistingImage = product.data.images.includes(image);

//     if (isExistingImage) {
//       setRemovedImages((prev) => [...prev, image]);
//     } else {
//       setUploadedFiles((prev) =>
//         prev.filter((file) => URL.createObjectURL(file) !== image)
//       );
//     }

//     // Remove the image from the preview list
//     setUploadedImages((prev) => prev.filter((img) => img !== image));
//   };


//   // Mutation
//   const updateProductMutation = useMutation({
//     mutationFn: async (body: any) => {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${id}`, {
//         method: "PATCH", // Use PATCH for updates
//         headers: { Authorization: `Bearer ${token}` },
//         body,
//       });
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || "Failed to update product");
//       }
//       return res.json();
//     },
//     onSuccess: () => {
//       toast.success("Product updated successfully");
//       queryClient.invalidateQueries({ queryKey: ["singleProduct", id] });
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//       setUploadedFiles([]); // Clear new files after successful upload
//     },
//     onError: (error: any) => {
//       toast.error(error.message || "Failed to update product");
//     },
//   });

//   // Submit
//   const onSubmit = (data: FormData) => {
//     const body = new FormData();

//     // Append newly uploaded files
//     uploadedFiles.forEach((file) => body.append("images", file));

//     // Append fields
//     body.append("title", data.title);
//     if (data.msrp) body.append("msrp", data.msrp);
//     if (data.moq) body.append("moq", data.moq);
//     if (data.unitPrice) body.append("unitPrice", data.unitPrice);
//     if (data.packPrice) body.append("discountPrice", data.packPrice);
//     if (data.quantity) body.append("quantity", data.quantity);
//     if (data.description) body.append("description", data.description ?? "");
//     // body.append("status", data.status);
//     if (data.category) body.append("category", data.category);
//     if (data.subCategory) body.append("subCategory", data.subCategory);
//     if (data.productType) body.append("productType", data.productType);
//     if (data.brandName) body.append("brand", data.brandName);

//     // Append arrays
//     data.size?.forEach((s) => body.append("sizes[]", s));
//     if (data.color) {
//       body.append("colors[]", data.color);
//     }

//     // Append the list of images to be removed.
//     removedImages.forEach((img) => body.append("removedImages[]", img));

//     updateProductMutation.mutate(body);
//   };

//   if (isProductLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[50vh]">
//         <Loader2 className="h-10 w-10 animate-spin text-[#797068]" />
//       </div>
//     );
//   }


//   return (
//     <div className="min-h-screen">
//       <div className="">
//         {/* Header */}
//         <div className="pb-5 flex justify-between items-center">
//           <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
//           <Button
//             size="sm"
//             className="bg-[#797068] hover:bg-[#3a3129] text-white text-base h-[50px] px-6"
//             type="submit"
//             form="product-form"
//             disabled={updateProductMutation.isPending}
//           >
//             <div className="flex items-center">
//               Update Product {updateProductMutation.isPending && <Loader2 className="animate-spin ml-2" />}
//             </div>
//           </Button>
//         </div>
//         {/* Breadcrumb */}
//         <div className="flex items-center text-sm text-gray-500 mb-6">
//           <span>Dashboard</span>
//           <ChevronRight className="w-4 h-4 mx-2" />
//           <span>Products List</span>
//           <ChevronRight className="w-4 h-4 mx-2" />
//           <span className="text-gray-900">Edit Product</span>
//         </div>

//         <Form {...form}>
//           <form
//             id="product-form"
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="grid grid-cols-1 lg:grid-cols-3 gap-8"
//           >
//             {/* Left Column */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Title */}
//               <Card>
//                 <CardContent>
//                   <FormField
//                     control={form.control}
//                     name="title"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-base font-semibold text-gray-900">
//                           Add Title
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Add your title..."
//                             className="w-full h-[50px] border border-[#B6B6B6]"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>

//               {/* MSRP & MOQ */}
//               <Card>
//                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <FormField
//                     control={form.control}
//                     name="msrp"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>MSRP</FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Manufacturer's Suggested Retail Price..."
//                             className="h-[50px] border border-[#B6B6B6]"
//                             {...field}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="moq"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>MOQ</FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Minimum Order Quantity..."
//                             className="h-[50px] border border-[#B6B6B6]"
//                             {...field}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>

//               {/* Price & Quantity */}
//               <Card>
//                 <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <FormField
//                     control={form.control}
//                     name="unitPrice"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Unit Price</FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Price per unit..."
//                             className="h-[50px] border border-[#B6B6B6]"
//                             {...field}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="packPrice"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Discount Price</FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Only when product is sold in packs..."
//                             className="h-[50px] border border-[#B6B6B6]"
//                             {...field}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="quantity"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Quantity</FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Add Quantity..."
//                             className="h-[50px] border border-[#B6B6B6]"
//                             {...field}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>

//               {/* Description */}
//               <Card>
//                 <CardContent>
//                   <FormField
//                     control={form.control}
//                     name="description"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Description</FormLabel>
//                         <FormControl>
//                           <ReactQuill
//                             theme="snow"
//                             value={field.value}
//                             onChange={field.onChange}
//                             placeholder="Enter product description..."
//                             modules={quillModules}
//                             formats={quillFormats}
//                             className="h-[250px]"
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>

//               {/* Size Tags Input */}
//               <Card >
//                 <CardContent>
//                   <Label className="text-sm font-medium  text-[#595959]">Size</Label>
//                   <Controller
//                     name="size"
//                     control={form.control}
//                     render={({ field }) => (
//                       <TagsInput
//                         value={field.value ?? []}
//                         onValueChange={field.onChange}
//                         placeholder="Enter sizes here..."
//                       />
//                     )}
//                   />
//                   {form.formState.errors.size && (
//                     <p className="text-red-500 text-sm">
//                       {form.formState.errors.size.message as string}
//                     </p>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Color Tags Input */}
//               <Card>
//                 <CardContent>
//                   <FormField
//                     control={form.control}
//                     name="color"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Color</FormLabel>
//                         <Select onValueChange={field.onChange} value={field.value}>
//                           <SelectTrigger className="h-[50px] border border-[#B6B6B6]">
//                             <SelectValue placeholder="Select a color" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {colorsData?.data.data.map((clr: any) => (
//                               <SelectItem key={clr._id} value={clr._id}>
//                                 <div className="flex items-center gap-2">
//                                   <span
//                                     className="w-4 h-4 rounded-full border"
//                                     style={{ backgroundColor: clr.code }}
//                                   />
//                                   {clr.name}
//                                 </div>
//                               </SelectItem>

//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>

//             </div>

//             {/* Right Column */}
//             <div className="space-y-4">
//               {/* Category */}
//               <Card>
//                 <CardContent>
//                   <FormField
//                     control={form.control}
//                     name="category"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Category</FormLabel>
//                         <Select
//                           onValueChange={(val) => {
//                             field.onChange(val);
//                             const selected = categoriesData?.data.find((c: any) => c._id === val);
//                             setSelectedCategory(selected);
//                           }}
//                           value={field.value}
//                         >
//                           <SelectTrigger className="h-[50px] border border-[#B6B6B6]">
//                             <SelectValue placeholder="Select a Category" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {categoriesData?.data.map((cat: any) => (
//                               <SelectItem key={cat._id} value={cat._id}>
//                                 {cat.name} {/* ✅ shows name instead of id */}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>

//               {/* Product Type */}
//               <Card>
//                 <CardContent>
//                   <FormField
//                     control={form.control}
//                     name="productType"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Product Type</FormLabel>
//                         {productTypes.length > 0 && (
//                           <Select disabled={deactiveProductType || productTypes.length === 0} onValueChange={field.onChange} value={field.value}>
//                             <SelectTrigger className="h-[50px] border border-[#B6B6B6]">
//                               <SelectValue placeholder="Select Product Type" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {productTypes.map((pt) => (
//                                 <SelectItem key={pt} value={pt}>
//                                   {pt}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         )}


//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>

//               {/* SubCategory */}
//               <Card>
//                 <CardContent>
//                   <FormField
//                     control={form.control}
//                     name="subCategory"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Sub-Category</FormLabel>
//                         <Select disabled={deactiveSubCategory || subCategories.length === 0} onValueChange={field.onChange} value={field.value}>
//                           <SelectTrigger className="h-[50px] border border-[#B6B6B6]">
//                             <SelectValue placeholder="Select Sub-Category" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {subCategories?.map((sc) => (
//                               <SelectItem key={sc._id} value={sc._id}>
//                                 {sc.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>

//               {/* Brand Name */}
//               <Card>
//                 <CardContent>
//                   <FormField
//                     control={form.control}
//                     name="brandName"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Brand Name</FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Write your Brand Name..."
//                             className="h-[50px] border border-[#B6B6B6]"
//                             {...field}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                 </CardContent>
//               </Card>

//               {/* Product Images */}
//               <Card>
//                 <CardContent>
//                   <FormLabel>Upload Images</FormLabel>
//                   <div className="grid grid-cols-4 gap-2">
//                     {uploadedImages.map((image, index) => (
//                       <div
//                         key={index}
//                         className="relative aspect-square border border-gray-300 rounded-lg overflow-hidden"
//                       >
//                         <Image
//                           width={300}
//                           height={300}
//                           src={image}
//                           alt={`Upload ${index + 1}`}
//                           className="w-full h-full object-cover"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveImage(image)}
//                           className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     ))}
//                     {Array.from({ length: Math.max(0, 4 - uploadedImages.length) }).map(
//                       (_, index) => (
//                         <div
//                           key={`empty-${index}`}
//                           className="aspect-square border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
//                         >
//                           <ImageIcon className="w-6 h-6 text-gray-300" />
//                         </div>
//                       )
//                     )}
//                   </div>
//                   <label className="mt-2 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
//                     <Upload className="w-5 h-5 mr-2" />
//                     <span className="text-sm">Upload Images</span>
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       className="hidden"
//                       onChange={handleImageUpload}
//                     />
//                   </label>
//                 </CardContent>
//               </Card>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }





/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Upload, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import "react-quill/dist/quill.snow.css";
import { TagsInput } from "@/components/ui/tagsInput";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ColorsResponse } from "../../../../../../types/colorDataTypes";

// React Quill Setup
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline"],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["code-block"],
  ],
};
const quillFormats = [
  "header",
  "font",
  "bold",
  "italic",
  "underline",
  "align",
  "list",
  "bullet",
  "code-block",
];

// Schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  msrp: z.string().optional(),
  moq: z.string().optional(),
  unitPrice: z.string().optional(),
  packPrice: z.string().optional(),
  quantity: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  productType: z.string().optional(),
  subCategory: z.string().optional(),
  brandName: z.string().optional(),
  size: z.array(z.string()).optional(),
  color: z.string().nonempty("Color is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function EditProduct({ id }: { id: string }) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [deactiveProductType, setDeactiveProductType] = useState(false);
  const [deactiveSubCategory, setDeactiveSubCategory] = useState(false);

  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      msrp: "",
      moq: "",
      unitPrice: "",
      packPrice: "",
      quantity: "",
      description: "",
      category: "",
      productType: "",
      subCategory: "",
      brandName: "",
      size: [],
      color: "",
    },
  });

  // Fetch categories
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery<any>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/all-categories?page=1&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
    enabled: !!token,
  });

  // Fetch single product
  const { data: product, isLoading: isProductLoading } = useQuery<any>({
    queryKey: ["singleProduct", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
    enabled: !!token && !!id,
  });

  // Fetch colors
  const { data: colorsData, isLoading: isColorsLoading } = useQuery<ColorsResponse>({
    queryKey: ["colors"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/color?page=1&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch colors");
      return res.json();
    },
    enabled: !!token,
  });

  // Set form values and images when product, categories, and colors data are available
  useEffect(() => {
    if (product && categoriesData && colorsData && token) {
      const productData = product.data;

      // Find category
      const initialCategory = categoriesData.data.find(
        (c: any) => c._id === productData.category?._id
      );

      if (initialCategory) {
        setSelectedCategory(initialCategory);
        const types = initialCategory.productType || [];
        setProductTypes(types);
        setDeactiveProductType(types.length === 0);

        // Fetch initial subcategories
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-category/category/${initialCategory._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then((res) => {
            if (!res.ok) {
              toast.error("Failed to fetch subcategories");
              return null;
            }
            return res.json();
          })
          .then((data) => {
            let subCats = [];
            if (data) {
              subCats = data.data.subCategories || [];
              // Filter unique subcategories by _id
              subCats = Array.from(
                new Map(subCats.map((sc: any) => [sc._id, sc])).values()
              );
              setSubCategories(subCats);
              setDeactiveSubCategory(subCats.length === 0);
            }
            // Reset form after subcategories are set
            form.reset({
              title: productData.title || "",
              msrp: productData.msrp?.toString() || "",
              moq: productData.moq?.toString() || "",
              unitPrice: productData.unitPrice?.toString() || "",
              packPrice: productData.discountPrice?.toString() || "",
              quantity: productData.quantity?.toString() || "",
              description: productData.description || "",
              brandName: productData.brand || "",
              size: productData.sizes || [],
              color: productData.colors?.[0]?._id || "",
              category: productData.category?._id || "",
              productType: productData.productType || "",
              subCategory: productData.subCategory?._id || "",
            });

            // Set uploaded images
            if (productData.images?.length > 0) {
              setUploadedImages(productData.images);
            }
          })
          .catch(() => {
            toast.error("Error fetching subcategories");
            // Still reset form even if subcategories fail
            form.reset({
              title: productData.title || "",
              msrp: productData.msrp?.toString() || "",
              moq: productData.moq?.toString() || "",
              unitPrice: productData.unitPrice?.toString() || "",
              packPrice: productData.discountPrice?.toString() || "",
              quantity: productData.quantity?.toString() || "",
              description: productData.description || "",
              brandName: productData.brand || "",
              size: productData.sizes || [],
              color: productData.colors?.[0]?._id || "",
              category: productData.category?._id || "",
              productType: productData.productType || "",
              subCategory: productData.subCategory?._id || "",
            });

            // Set uploaded images
            if (productData.images?.length > 0) {
              setUploadedImages(productData.images);
            }
          });
      }
    }
  }, [product, categoriesData, colorsData, form, token]);

  // Fetch subcategories when selectedCategory changes (for category change after initial load)
  useEffect(() => {
    if (!selectedCategory || !token) return;

    const types = selectedCategory.productType || [];
    setProductTypes(types);
    setDeactiveProductType(types.length === 0);

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-category/category/${selectedCategory._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        if (!res.ok) {
          toast.error("Failed to fetch subcategories");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          let subCats = data.data.subCategories || [];
          // Filter unique subcategories by _id
          subCats = Array.from(
            new Map(subCats.map((sc: any) => [sc._id, sc])).values()
          );
          setSubCategories(subCats);
          setDeactiveSubCategory(subCats.length === 0);
        }
      })
      .catch(() => {
        toast.error("Error fetching subcategories");
      });
  }, [selectedCategory, token]);

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setUploadedFiles((prev) => [...prev, ...files]);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...previewUrls]);
  };

  // Remove Image Handler
  const handleRemoveImage = (image: string) => {
    const isExistingImage = product?.data?.images?.includes(image) || false;

    if (isExistingImage) {
      setRemovedImages((prev) => [...prev, image]);
    } else {
      setUploadedFiles((prev) =>
        prev.filter((file) => URL.createObjectURL(file) !== image)
      );
    }

    // Remove the image from the preview list
    setUploadedImages((prev) => prev.filter((img) => img !== image));
  };

  // Mutation
  const updateProductMutation = useMutation({
    mutationFn: async (body: any) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${id}`, {
        method: "PATCH", // Use PATCH for updates
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update product");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["singleProduct", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setUploadedFiles([]); // Clear new files after successful upload
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update product");
    },
  });

  // Submit
  const onSubmit = (data: FormData) => {
    const body = new FormData();

    // Append newly uploaded files
    uploadedFiles.forEach((file) => body.append("images", file));

    // Append fields
    body.append("title", data.title);
    if (data.msrp) body.append("msrp", data.msrp);
    if (data.moq) body.append("moq", data.moq);
    if (data.unitPrice) body.append("unitPrice", data.unitPrice);
    if (data.packPrice) body.append("discountPrice", data.packPrice);
    if (data.quantity) body.append("quantity", data.quantity);
    if (data.description) body.append("description", data.description ?? "");
    if (data.category) body.append("category", data.category);
    if (data.subCategory) body.append("subCategory", data.subCategory);
    if (data.productType) body.append("productType", data.productType);
    if (data.brandName) body.append("brand", data.brandName);

    // Append arrays
    data.size?.forEach((s) => body.append("sizes[]", s));
    if (data.color) {
      body.append("colors[]", data.color);
    }

    // Append the list of images to be removed.
    removedImages.forEach((img) => body.append("removedImages[]", img));

    updateProductMutation.mutate(body);
  };

  if (isProductLoading || isCategoriesLoading || isColorsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#797068]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
          <Button
            size="sm"
            className="bg-[#797068] hover:bg-[#3a3129] text-white text-base h-[50px] px-6"
            type="submit"
            form="product-form"
            disabled={updateProductMutation.isPending}
          >
            <div className="flex items-center">
              Update Product {updateProductMutation.isPending && <Loader2 className="animate-spin ml-2" />}
            </div>
          </Button>
        </div>
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-14">
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>Products List</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">Edit Product</span>
        </div>

        <Form {...form}>
          <form
            id="product-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <Card>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-gray-900">
                          Add Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Add your title..."
                            className="w-full h-[50px] border border-[#B6B6B6]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* MSRP & MOQ */}
              <Card>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="msrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MSRP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Manufacturer's Suggested Retail Price..."
                            className="h-[50px] border border-[#B6B6B6]"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="moq"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MOQ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Minimum Order Quantity..."
                            className="h-[50px] border border-[#B6B6B6]"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Price & Quantity */}
              <Card>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="unitPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Price per unit..."
                            className="h-[50px] border border-[#B6B6B6]"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="packPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Only when product is sold in packs..."
                            className="h-[50px] border border-[#B6B6B6]"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Add Quantity..."
                            className="h-[50px] border border-[#B6B6B6]"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter product description..."
                            modules={quillModules}
                            formats={quillFormats}
                            className="h-[250px]"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Size Tags Input */}
              <Card className="pt-[45px]" >
                <CardContent>
                  <Label className="text-sm font-medium  text-[#595959]">Size</Label>
                  <Controller
                    name="size"
                    control={form.control}
                    render={({ field }) => (
                      <TagsInput
                        value={field.value ?? []}
                        onValueChange={field.onChange}
                        placeholder="Enter sizes here..."
                      />
                    )}
                  />
                  {form.formState.errors.size && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.size.message as string}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Color Tags Input */}
              <Card>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-[50px] border border-[#B6B6B6]">
                            <SelectValue placeholder="Select a color" />
                          </SelectTrigger>
                          <SelectContent>
                            {colorsData?.data.data.map((clr: any) => (
                              <SelectItem key={clr._id} value={clr._id}>
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-4 h-4 rounded-full border"
                                    style={{ backgroundColor: clr.code }}
                                  />
                                  {clr.name}
                                </div>
                              </SelectItem>

                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Category */}
              <Card>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            const selected = categoriesData?.data.find((c: any) => c._id === val);
                            setSelectedCategory(selected);
                            form.setValue("productType", "");
                            form.setValue("subCategory", "");
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="h-[50px] border border-[#B6B6B6]">
                            <SelectValue placeholder="Select a Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoriesData?.data.map((cat: any) => (
                              <SelectItem key={cat._id} value={cat._id}>
                                {cat.name} {/* ✅ shows name instead of id */}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Product Type */}
              <Card>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Type</FormLabel>
                        {productTypes.length > 0 && (
                          <Select disabled={deactiveProductType || productTypes.length === 0} onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-[50px] border border-[#B6B6B6]">
                              <SelectValue placeholder="Select Product Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {productTypes.map((pt) => (
                                <SelectItem key={pt} value={pt}>
                                  {pt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}


                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* SubCategory */}
              <Card>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="subCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub-Category</FormLabel>
                        <Select disabled={deactiveSubCategory || subCategories.length === 0} onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-[50px] border border-[#B6B6B6]">
                            <SelectValue placeholder="Select Sub-Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {subCategories?.map((sc) => (
                              <SelectItem key={sc._id} value={sc._id}>
                                {sc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Brand Name */}
              <Card>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="brandName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Write your Brand Name..."
                            className="h-[50px] border border-[#B6B6B6]"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Product Images */}
              <Card>
                <CardContent>
                  <FormLabel>Upload Images</FormLabel>
                  <div className="grid grid-cols-4 gap-2">
                    {uploadedImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square border border-gray-300 rounded-lg overflow-hidden"
                      >
                        <Image
                          width={300}
                          height={300}
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(image)}
                          className="absolute top-1 right-1 bg-red-500 w-[30px] h-[30px] text-white rounded-full p-1 hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - uploadedImages.length) }).map(
                      (_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
                        >
                          <ImageIcon className="w-6 h-6 text-gray-300" />
                        </div>
                      )
                    )}
                  </div>
                  <label className="mt-2 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-5 h-5 mr-2" />
                    <span className="text-sm">Upload Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
