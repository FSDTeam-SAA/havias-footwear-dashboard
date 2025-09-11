import {z} from 'zod'

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  msrp: z.string().optional(),
  moq: z.string().optional(),
  unitPrice: z.string().optional(),
  packPrice: z.string().optional(),
  quantity: z.string().optional(),
  description: z.string().optional(),
  category: z.string().nonempty("Category is required"),
  productType: z.string().optional(),
  subCategory: z.string().nonempty("Category is required"),
  brandName: z.string().optional(),
  size: z.array(z.string()).min(1, "At least one size is required"),
  color: z.array(z.string()).min(1, "At least one color is required"),
});

export type ProductData = z.infer<typeof productSchema>;