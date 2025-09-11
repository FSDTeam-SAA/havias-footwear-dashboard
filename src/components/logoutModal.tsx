"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface LogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout?: () => void;
  title?: string;
}

export function LogoutModal({ open, onOpenChange, onLogout, title }: LogoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title || "Are you sure you want to log out?"}</DialogTitle>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              // Close modal
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              signOut({ callbackUrl: "/" });
              if (onLogout) onLogout();
              // Ensure modal closes immediately
              onOpenChange(false);
            }}
          >
            Log Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
