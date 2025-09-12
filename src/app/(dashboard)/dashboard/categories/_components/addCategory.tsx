"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent,  } from "@/components/ui/card";
import Title from "../../_components/Title";
import { Loader2, Save } from "lucide-react";
import { TagsInput } from "@/components/ui/tagsInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 1. Define Zod schema
const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    productType: z.array(z.string()).min(1, "At least one product type is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AddCategories() {
    const session = useSession();
    const queryClient = useQueryClient();
    const token = (session?.data?.user as { accessToken: string })?.accessToken;

    // 2. Initialize React Hook Form with Zod
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: "", productType: [] },
    });

    // 3. Mutation
    const addCategory = useMutation({
        mutationFn: async (payload: CategoryFormValues) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to add category");
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Category added successfully");
            queryClient.invalidateQueries({ queryKey: ["blog"] });
            reset(); // Reset form
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to add category");
        },
    });

    // 4. Submit handler
    const onSubmit = (data: CategoryFormValues) => {
        addCategory.mutate(data);
    };

    return (
        <div className="container mx-auto p-6">
            <Title title="Add Categories" active="Dashboard > Categories > Add Categories" />
            <Card className="mt-10 shadow-none bg-transparent border-none">
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Category Name */}
                        <p className="text-[#272727] font-semibold text-[20px] mb-2">General Information</p>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#595959]">Category Name</label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Type category name here..."
                                        className="w-full border border-gray-300 bg-transparent rounded-md py-3 px-3"
                                    />
                                )}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        {/* Tags Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#595959]">Product Type</label>
                            <Controller
                                name="productType"
                                control={control}
                                render={({ field }) => (
                                    <TagsInput
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        placeholder="Enter Product Type here..."
                                    />
                                )}
                            />
                            {errors.productType && <p className="text-red-500 text-sm">{errors.productType.message}</p>}
                        </div>

                        {/* Save Button */}
                        <div className="w-full flex justify-end">
                            <Button
                                type="submit"
                                className="mt-4 bg-btnPrimary hover:bg-btnPrimary/60"
                                disabled={addCategory.isPending}
                            >
                                <Save /> Save {addCategory.isPending && <Loader2 className="animate-spin ml-2" />}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
