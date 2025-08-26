"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
  rememberMe: z.boolean(),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        email: values?.email,
        password: values?.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      toast.success("Login successful!");
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
      <div className="w-full md:w-[547px] p-3 md:p-7 lg:p-8 rounded-[16px] bg-white">
        <h3 className="text-2xl md:text-[28px] lg:text-[32px] font-extrabold text-[#1F2937] text-center leading-[120%] ">
          Welcome Back
        </h3>
        <p className="text-base font-normal text-[#787878] leading-[120%] pt-4 text-center">Enter to get unlimited data & information</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-5 md:pt-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-base font-medium leading-[120%] text-[#293440] pb-2">
                    Email{" "}
                    <sup>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                      >
                        <path
                          d="M8 2.94136L5.09314 2.75025L3.99841 0L2.90367 2.75025L0 2.94136L2.22709 4.83239L1.49628 7.70097L3.99841 6.11939L6.50055 7.70097L5.76973 4.83239L8 2.94136Z"
                          fill="#293440"
                        />
                      </svg>
                    </sup>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[48px] text-base font-medium leading-[120%] text-[#293440] rounded-[8px] p-4 border border-[#6C6C6C] placeholder:text-[#787878]"
                      placeholder="Enter your email ...."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-base font-medium leading-[120%] text-[#293440] pb-2">
                    Password
                    <sup>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                      >
                        <path
                          d="M8 2.94136L5.09314 2.75025L3.99841 0L2.90367 2.75025L0 2.94136L2.22709 4.83239L1.49628 7.70097L3.99841 6.11939L6.50055 7.70097L5.76973 4.83239L8 2.94136Z"
                          fill="#293440"
                        />
                      </svg>
                    </sup>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="w-full h-[48px] text-base font-medium leading-[120%] text-[#293440] rounded-[8px] p-4 border border-[#6C6C6C] placeholder:text-[#787878]"
                        placeholder="Enter Password ...."
                        {...field}
                      />
                      <button type="button" className="absolute top-3.5 right-4">
                        {showPassword ? (
                          <Eye onClick={() => setShowPassword(!showPassword)} />
                        ) : (
                          <EyeOff
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="w-full flex items-center justify-between">
                  <FormItem className="flex items-center gap-[10px]">
                    <FormControl className="mt-2">
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-white border-primary"
                      />
                    </FormControl>
                    <Label
                      className="text-sm font-medium text-primary leading-[120%] font-manrope"
                      htmlFor="rememberMe"
                    >
                      Remember Me
                    </Label>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                  <Link
                    className="text-sm font-medium text-[#293440] leading-[120%] hover:underline"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}
            />

            <Button
              disabled={isLoading}
              className="text-base font-medium text-[#F8FAF9] leading-[120%] rounded-[8px] w-full h-[48px] bg-btnPrimary hover:bg-btnPrimary/80"
              type="submit"
            >
              {isLoading ? "Sign In ..." : "Sign In"}
            </Button>

            {/* <p className="text-sm font-medium leading-[120%] text-[#293440] text-center ">
              Don’t have an account?
              <Link
                href="/sign-up"
                className="text-[#293440] pl-1 hover:underline"
              >
                Register Here Now
              </Link>{" "}
            </p> */}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
