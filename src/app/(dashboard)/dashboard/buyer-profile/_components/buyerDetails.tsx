import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import React from 'react'

interface BuyerDetailsProps {
    id: string
    open: boolean
    openChange: (open: boolean) => void
}

const BuyerDetails = ({ id, open, openChange }: BuyerDetailsProps) => {
    const session = useSession();
    const token = (session?.data?.user as { accessToken: string })?.accessToken;

    const { data: singleBuyer } = useQuery({
        queryKey: ["singleBuyer", id],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/admin/buyers/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Failed to fetch buyer");
            return res.json();
        },
        enabled: !!token && !!id,
    });

    const buyer = singleBuyer?.data;

    return (
        <Dialog open={open} onOpenChange={openChange}>
            <DialogContent className="sm:max-w-md">
                {buyer && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Buyer Details</DialogTitle>
                            <DialogDescription>
                                Full information about this buyer
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex items-center gap-4 py-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src={buyer.user.profileImage || ""}
                                    alt={buyer.user.name}
                                />
                                <AvatarFallback>
                                    {buyer.user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-lg font-semibold">{buyer.user.name}</p>
                                <p className="text-sm text-gray-500">
                                    ID: {buyer.user._id}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Email:</span> {buyer.user.email}</p>
                            <p><span className="font-medium">Phone:</span> {buyer.user.phone}</p>
                            <p><span className="font-medium">Total Orders:</span> {buyer.stats.totalOrders}</p>
                            <p><span className="font-medium">Delivered:</span> {buyer.stats.deliveredOrders}</p>
                            <p><span className="font-medium">Pending:</span> {buyer.stats.pendingOrders}</p>
                            <p><span className="font-medium">Cancelled:</span> {buyer.stats.cancelledOrders}</p>
                            <p><span className="font-medium">Total Spent:</span> ${buyer.stats.totalSpent.toFixed(2)}</p>
                        </div>

                        <DialogFooter>
                            <Button variant="secondary" onClick={() => openChange(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default BuyerDetails
