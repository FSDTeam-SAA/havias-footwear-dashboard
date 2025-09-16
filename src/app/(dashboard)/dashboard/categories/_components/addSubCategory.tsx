"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Title from "../../_components/Title";
import { Loader2, Save, Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryResponse } from "../../../../../../types/categoryDataType";

const subCategorySchema = z.object({
    categoryId: z.string().min(1, "Category is required"),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
});

type SubCategoryFormValues = z.infer<typeof subCategorySchema>;

export default function AddSubCategories() {
    const session = useSession();
    const queryClient = useQueryClient();
    const token = (session?.data?.user as { accessToken: string })?.accessToken;

    const [inputValue, setInputValue] = useState(""); // State for the single input field

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<SubCategoryFormValues>({
        resolver: zodResolver(subCategorySchema),
        defaultValues: { categoryId: "", tags: [] },
    });

    const { data } = useQuery<CategoryResponse>({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/all-categories?page=1&limit=50`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch categories");
            return res.json();
        },
        enabled: !!token,
    });

    const addSubCategoryMutation = useMutation({
        mutationFn: async (payload: { categoryId: string; name: string[] }) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to add subcategory");
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Subcategory added successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            reset();
            setInputValue("");
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to add subcategory");
        },
    });

    const onSubmit = (formData: SubCategoryFormValues) => {
        const payload = {
            categoryId: formData.categoryId,
            name: formData.tags
        };
        addSubCategoryMutation.mutate(payload);
    };

    return (
        <div className="">
            <div className="border-b border-e-gray-300 pb-7">
                <Title title="Add Subcategories" active="Dashboard > Categories > Add Subcategories" />
            </div>
            <Card className="mt-10 shadow-none bg-transparent border-none">
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

                        {/* Category Dropdown */}
                        <div className="space-y-2">
                            <label className="text-[18px] font-medium text-[#595959]">Select Category</label>
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full !h-[50px] text-[18px] border border-gray-300">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {data?.data.map((cat) => (
                                                <SelectItem key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
                        </div>

                        {/* Tags Input with Plus Button */}
                        <div className="space-y-2">
                            <label className="text-[18px] font-medium text-[#595959]">Sub-Category Name</label>
                            <Controller
                                name="tags"
                                control={control}
                                render={({ field }) => {

                                    const addTag = () => {
                                        const trimmed = inputValue.trim();
                                        if (trimmed && !field.value.includes(trimmed)) {
                                            field.onChange([...field.value, trimmed]);
                                            setInputValue("");
                                        }
                                    };

                                    const removeTag = (tag: string) => {
                                        field.onChange(field.value.filter((t: string) => t !== tag));
                                    };

                                    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addTag();
                                        }
                                    };

                                    return (
                                        <div className="flex flex-col w-full">
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Enter Sub-Category Name..."
                                                    className="flex-1 border border-gray-300 bg-transparent rounded-md h-[50px] px-3"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={addTag}
                                                    className="ml-2 h-[50px] w-[50px] flex items-center justify-center"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </Button>
                                            </div>

                                            {/* Display added tags */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {field.value.map((tag: string, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-1 bg-gray-200 text-gray-800 px-2 py-1 rounded-full"
                                                    >
                                                        <span>{tag}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTag(tag)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                            {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}
                        </div>

                        {/* Save Button */}
                        <div className="w-full flex justify-end">
                            <Button
                                type="submit"
                                className="mt-4 bg-btnPrimary hover:bg-btnPrimary/60 !h-[50px] text-base w-[100px]"
                                disabled={addSubCategoryMutation.isPending}
                            >
                                <Save className="!w-[20px] !h-[20px]"/> Save {addSubCategoryMutation.isPending && <Loader2 className="animate-spin ml-2" />}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
