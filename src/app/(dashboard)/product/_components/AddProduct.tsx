/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Upload, Plus, ImageIcon } from "lucide-react";
import Image from "next/image";
import "react-quill/dist/quill.snow.css";
import Link from "next/link";

// --------------------
// Types
// --------------------
type FormData = {
  title: string;
  vendorName: string;
  msrp: string;
  moq: string;
  unitPrice: string;
  packPrice: string;
  quantity: string;
  description: string;
  status: "draft" | "active";
  category: string;
};

// --------------------
// React Quill Setup
// --------------------
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

// --------------------
// AddProduct Component
// --------------------
export default function AddProduct() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    vendorName: "",
    msrp: "",
    moq: "",
    unitPrice: "",
    packPrice: "",
    quantity: "",
    description: "",
    status: "draft",
    category: "",
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages((prev) => [
            ...prev,
            event.target?.result as string,
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="pb-5">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Add Products
            </h1>
            <Button
              size="sm"
              className="bg-[#797068] hover:bg-[#3a3129] text-white text-base h-[50px] px-6"
            >
              <Link href="/product/add" className="flex items-center">
                {/* <Plus className="h-4 w-4 mr-2" /> */}
                Publish Product
              </Link>
            </Button>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>Products List</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900">Add Products</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardContent className="">
                <Label
                  htmlFor="title"
                  className="text-base leading-[120%] font-semibold text-gray-900 mb-2 block"
                >
                  Add Title
                </Label>
                <Input
                  id="title"
                  placeholder="Add your title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full h-[50px] border border-[#B6B6B6]"
                />
              </CardContent>
            </Card>

            {/* Vendor Name */}
            <Card>
              <CardContent className="">
                <Label
                  htmlFor="vendor"
                  className="text-base font-semibold text-gray-900 mb-2 block"
                >
                  Add Vendor Name
                </Label>
                <Input
                  id="vendor"
                  placeholder="Add vendor name..."
                  value={formData.vendorName}
                  onChange={(e) =>
                    handleInputChange("vendorName", e.target.value)
                  }
                  className="w-full h-[50px] border border-[#B6B6B6]"
                />
              </CardContent>
            </Card>

            {/* MSRP and MOQ */}
            <Card>
              <CardContent className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="msrp"
                      className="text-base font-semibold text-gray-900 mb-2 block"
                    >
                      MSRP
                    </Label>
                    <Input
                      id="msrp"
                      placeholder="Manufacturer's Suggested Retail Price..."
                      value={formData.msrp}
                      className="w-full h-[50px] border border-[#B6B6B6]"
                      onChange={(e) =>
                        handleInputChange("msrp", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="moq"
                      className="text-base font-semibold text-gray-900 mb-2 block"
                    >
                      MOQ
                    </Label>
                    <Input
                      id="moq"
                      placeholder="Minimum Order Quantity..."
                      className="w-full h-[50px] border border-[#B6B6B6]"
                      value={formData.moq}
                      onChange={(e) => handleInputChange("moq", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price and Quantity */}
            <Card>
              <CardContent className="">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label
                      htmlFor="unitPrice"
                      className="text-base font-semibold text-gray-900 mb-2 block"
                    >
                      Unit Price
                    </Label>
                    <Input
                      id="unitPrice"
                      placeholder="Price per unit..."
                      className="w-full h-[50px] border border-[#B6B6B6]"
                      value={formData.unitPrice}
                      onChange={(e) =>
                        handleInputChange("unitPrice", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="packPrice"
                      className="text-base font-semibold text-gray-900 mb-2 block"
                    >
                      Pack Price
                    </Label>
                    <Input
                      id="packPrice"
                      placeholder="Only when product is sold in packs..."
                      className="w-full h-[50px] border border-[#B6B6B6]"
                      value={formData.packPrice}
                      onChange={(e) =>
                        handleInputChange("packPrice", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="quantity"
                      className="text-base font-semibold text-gray-900 mb-2 block"
                    >
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      placeholder="Add Quantity..."
                      className="w-full h-[50px] border border-[#B6B6B6]"
                      value={formData.quantity}
                      onChange={(e) =>
                        handleInputChange("quantity", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="pb-10">
                <Label className="text-base font-semibold text-gray-900 mb-2 block">
                  Description
                </Label>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(value) => handleInputChange("description", value)}
                  placeholder="Enter product description..."
                  modules={quillModules}
                  formats={quillFormats}
                  className="h-[250px]"
                />
              </CardContent>
            </Card>

            {/* Variants */}
            <Card className="py-3">
              <CardContent className="space-y-2">
                <Label className="text-base font-semibold text-gray-900 block">
                  Variants
                </Label>
                <Button
                  variant="outline"
                  className="w-full border-dashed flex items-center justify-center gap-2 px-3 py-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add options like size or color
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            {/* Status */}
            <Card>
              <CardContent className="p-6">
                <RadioGroup
                  value={formData.status}
                  onValueChange={(value) =>
                    handleInputChange("status", value as FormData["status"])
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="draft" id="draft" />
                    <Label htmlFor="draft" className="text-sm">
                      Draft
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active" className="text-sm">
                      Active
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold text-gray-900 mb-2 block">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger className="w-full h-[50px] border border-[#B6B6B6]">
                    <SelectValue placeholder="Select a Collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-sm font-medium text-gray-900 mb-4 block">
                  Add Product Image
                </Label>

                {/* Main upload area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-1">
                      Note: Upload Max200 *200 pixels and
                    </p>
                    <p className="text-sm text-gray-500">Formats PNG</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      Upload Image
                    </Button>
                  </div>
                </div>

                {/* Image preview grid */}
                <div className="grid grid-cols-4 gap-2">
                  {uploadedImages.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square border border-gray-300 rounded-lg overflow-hidden"
                    >
                      <Image
                        width={300}
                        height={300}
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {/* Empty slots */}
                  {Array.from({
                    length: Math.max(0, 4 - uploadedImages.length),
                  }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="aspect-square border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
                    >
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
