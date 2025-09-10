"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
import Title from "../../_components/Title";
import { Loader2, Save } from "lucide-react";
import { TagsInput } from "@/components/ui/tagsInput";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryResponse } from "../../../../../../types/categoryDataType";

// 1. Zod schema
const subCategorySchema = z.object({
    categoryId: z.string().min(1, "Category is required"),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
});

type SubCategoryFormValues = z.infer<typeof subCategorySchema>;

export default function AddSubCategories() {
    const session = useSession();
    const queryClient = useQueryClient();
    const token = (session?.data?.user as { accessToken: string })?.accessToken;

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<SubCategoryFormValues>({
        resolver: zodResolver(subCategorySchema),
        defaultValues: { categoryId: "", tags: [] },
    });

    // Fetch all categories
    const { data, isLoading } = useQuery<CategoryResponse>({
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

    console.log(isLoading)
    // Mutation to create subcategory
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
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to add subcategory");
        },
    });

    const onSubmit = (formData: SubCategoryFormValues) => {
        console.log("Selected Category ID:", formData.categoryId);
        console.log("Selected Tags:", formData.tags);
        const payload = {
            categoryId: formData.categoryId,
            name: formData.tags
        }
        addSubCategoryMutation.mutate(payload);
    };

    return (
        <div className="container mx-auto p-6">
            <Title title="Add Subcategories" active="Dashboard > Categories > Add Subcategories" />
            <Card className="mt-10 shadow-none bg-transparent border-none">
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Category Dropdown using ShadCN Select */}
                          <p className="text-[#272727] font-semibold text-[20px] mb-2">General Information</p>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#595959]">Select Category</label>
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
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

                        {/* Tags Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#595959]">Sub-Category Name</label>
                            <Controller
                                name="tags"
                                control={control}
                                render={({ field }) => (
                                    <TagsInput value={field.value} onValueChange={field.onChange} placeholder="Enter Sub-Category Name here..." />
                                )}
                            />
                            {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}
                        </div>

                        {/* Save Button */}
                        <div className="w-full flex justify-end">
                            <Button
                                type="submit"
                                className="mt-4 bg-btnPrimary hover:bg-btnPrimary/60"
                                disabled={addSubCategoryMutation.isPending}
                            >
                                <Save /> Save {addSubCategoryMutation.isPending && <Loader2 className="animate-spin ml-2" />}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
