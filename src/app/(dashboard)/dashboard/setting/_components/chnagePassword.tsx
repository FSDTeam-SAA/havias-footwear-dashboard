

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({
    isOpen,
    onClose,

}: ChangePasswordModalProps) {
    const session = useSession();
    const token = (session?.data?.user as { accessToken: string })?.accessToken;
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const changePasswordMutation = useMutation({
        mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                }
            );

            if (!res.ok) {
                
                const errorData = await res.json();
                throw new Error(errorData.message || "Password change failed");
            }

            return res.json();
        },
        onSuccess: (data) => {
            console.log(data)
            toast.success(data.message || "Password changed successfully");
            onClose();
        },
        onError: (error) => {
            toast.error(error.message || "Password change failed");
        },
    });

    const handleSave = () => {
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        changePasswordMutation.mutate({
            oldPassword: formData.currentPassword,
            newPassword: formData.newPassword,
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSave}
                        disabled={changePasswordMutation.isPending}
                    >
                        {changePasswordMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
