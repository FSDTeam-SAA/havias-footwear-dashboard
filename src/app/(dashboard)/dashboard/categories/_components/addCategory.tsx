"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Title from "../../_components/Title";
import { Loader2, Save, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  productType: z
    .array(z.string())
    .min(1, "At least one product type is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const AddCategories: React.FC = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const [inputValue, setInputValue] = useState<string>(""); // <-- Move state here

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", productType: [] },
  });

  const addCategory = useMutation({
    mutationFn: async (payload: CategoryFormValues) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add category");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Category added successfully");
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      reset();
      setInputValue(""); // Clear input after successful submission
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to add category"
      );
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    addCategory.mutate(data);
  };

  return (
    <div>
      <div className="border-b border-[#6459491A] pb-7">
        <Title
          title="Add Categories"
          active="Dashboard > Categories > Add Categories"
        />
      </div>
      <Card className="mt-10 shadow-none bg-transparent border-none">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Category Name */}
            <div className="space-y-2">
              <label className="text-base font-medium text-[#595959]">
                Category Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Type category name here..."
                    className="w-full border border-gray-300 bg-transparent rounded-md h-[50px] px-3"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Product Type Input with Plus Button */}
            <div className="space-y-2">
              <label className="text-base font-medium text-[#595959]">
                Product Type
              </label>
              <Controller
                name="productType"
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
                          placeholder="Enter Product Type..."
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
              {errors.productType && (
                <p className="text-red-500 text-sm">{errors.productType.message}</p>
              )}
            </div>

            {/* Save Button */}
            <div className="w-full flex justify-end">
              <Button
                type="submit"
                className="mt-4 !h-[50px] !w-[100px] text-base bg-btnPrimary hover:bg-btnPrimary/60"
                disabled={addCategory.isPending}
              >
                <Save className="!w-[20px] !h-[20px]" /> Save{" "}
                {addCategory.isPending && (
                  <Loader2 className="animate-spin ml-2" />
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategories;
