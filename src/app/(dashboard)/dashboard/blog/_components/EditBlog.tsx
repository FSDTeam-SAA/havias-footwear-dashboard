"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, X, ImageDown, Save, Loader2 } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-48 bg-gray-50 animate-pulse rounded-md"></div>
  ),
});
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";

interface BlogData {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface BlogResponse {
  data: BlogData;
}

export default function EditBlog({ id }: { id: string }) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const session = useSession();
  const token = (session?.data?.user as { accessToken?: string })?.accessToken;
  const queryClient = useQueryClient();

  // Fetch single blog data
  const { data, isLoading } = useQuery<BlogResponse>({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch blog");
      return res.json();
    },
    enabled: !!token,
  });

  console.log(isLoading)

  // Pre-fill form when data is loaded
  useEffect(() => {
    if (data?.data) {
      setTitle(data.data.title);
      setDescription(data.data.description);
      setThumbnailPreview(data.data.thumbnail);
    }
  }, [data]);

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

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setThumbnail(file);
    const reader = new FileReader();
    reader.onload = (ev) => setThumbnailPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Update blog mutation
  const updateBlogMutation = useMutation({
    mutationFn: async () => {
      if (!title || !description) throw new Error("Title and description are required");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/${id}`, {
        method: "PATCH",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update blog");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Blog updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      router.push("/dashboard/blog");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update blog");
    },
  });

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
            <span className="text-gray-900">Edit blog</span>
          </nav>
        </div>
        <Button
          onClick={() => updateBlogMutation.mutate()}
          className="bg-gray-700 text-base h-[50px] hover:bg-gray-800 text-white px-6"
        >
          <Save size={20} className="" />
          Save Blog {updateBlogMutation.isPending && <Loader2 className="animate-spin mr-2" />}
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
                  className="h-[350px]"
                />
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
                    className="w-full h-[380px] object-cover rounded-lg border"
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
