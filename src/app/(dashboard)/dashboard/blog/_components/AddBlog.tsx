

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, X, ImageDown, Loader2 } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-48 bg-gray-50 animate-pulse rounded-md"></div>
  ),
});

// Import ReactQuill styles
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AddBlog() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const descriptionImageInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter()
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const queryClient = useQueryClient();
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["image"],
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
    "image",
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/"))
      return toast.error("Please select an image file");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("File size should be less than 5MB");

    setThumbnail(file);
    const reader = new FileReader();
    reader.onload = (ev) => setThumbnailPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // const handleDescriptionImageUpload = () => {
  //   const input = descriptionImageInputRef.current;
  //   if (!input) return;

  //   input.click();
  // };

  const handleDescriptionImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const readerPromises = Array.from(files).map((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return Promise.resolve();
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const imageUrl = ev.target?.result as string;
          const quill = document.querySelector(".ql-editor") as HTMLElement;
          if (quill) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const range = (window as any).Quill?.find(quill)?.getSelection();
            if (range) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (quill as any).children[0].focus();
              setTimeout(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window as any).Quill?.find(quill)?.insertEmbed(range.index, "image", imageUrl);
              }, 0);
            }
          }
          resolve(imageUrl);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readerPromises).then(() => {
      if (descriptionImageInputRef.current) {
        descriptionImageInputRef.current.value = "";
      }
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Blog submission
  const addBlogMutation = useMutation({
    mutationFn: async () => {
      if (!title || !description || !thumbnail) throw new Error("All fields are required");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("thumbnail", thumbnail);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blog`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add blog");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Blog added successfully");
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      router.push("/dashboard/blog");
      setTitle("");
      setDescription("");

      handleRemoveImage();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to add blog");
    },
  });

  const handleSave = () => {
    const blogData = { title, description, thumbnail };
    console.log("Saving blog:", blogData);
    addBlogMutation.mutate();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Blog Management
          </h1>
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Dashboard</span>
            <ChevronRight size={16} />
            <span>Blog management</span>
            <ChevronRight size={16} />
            <span className="text-gray-900">Add blog</span>
          </nav>
        </div>
        <Button
          onClick={handleSave}
          disabled={addBlogMutation.isPending}
          className="bg-gray-700 text-base h-[50px] hover:bg-gray-800 text-white px-6"
        >
          Add Blog {addBlogMutation.isPending && <Loader2 className="animate-spin" />}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Blog Form */}
        <div className="flex-1">
          <Card className="">
            <CardContent className="space-y-6">
              {/* Blog Title */}
              <div>
                <Label className="block text-sm font-medium text-gray-900 mb-3">
                  Blog Title
                </Label>
                <Input
                  type="text"
                  placeholder="Add your title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-[50px] border border-gray-300 rounded-lg focus:border-gray-500"
                />
              </div>

              {/* Description */}
              <div>
                <Label className="text-base font-semibold text-gray-900 mb-2 block">
                  Description
                </Label>
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  placeholder="Enter blog description..."
                  modules={quillModules}
                  formats={quillFormats}
                  className="h-[250px]"
                />
                <input
                  type="file"
                  ref={descriptionImageInputRef}
                  onChange={handleDescriptionImageSelect}
                  accept="image/*"
                  multiple
                  className="hidden h-[300px]"
                />
                {/* <Button
                  onClick={handleDescriptionImageUpload}
                  className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
                >
                  Add Image to Description
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Thumbnail */}
        <div className="w-full lg:w-[550px]">
          <Card className="">
            <CardContent className="p-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Thumbnail
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />

              {thumbnailPreview ? (
                <div className="relative">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    width={400}
                    height={400}
                    className="w-full object-cover h-[380px] rounded-lg border"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                    type="button"
                  >
                    <X size={16} />
                  </button>
                  <div className="mt-3 text-center">
                    <Button
                      onClick={handleUploadClick}
                      className="text-sm text-white underline"
                      type="button"
                    >
                      Change image
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={handleUploadClick}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <ImageDown size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      Click to upload thumbnail
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}