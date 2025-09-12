// "use client";

// import React, { useEffect, useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { PencilIcon, Save } from "lucide-react";
// import Link from "next/link";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { useQuery } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import { UserProfileResponse } from "../../../../../../types/userDataType";

// export default function ProfilePage() {
//     const [isEditing, setIsEditing] = useState(false);
//     const [avatar, setAvatar] = useState<File | null>(null);
//     const session = useSession();
//     const token = (session?.data?.user as { accessToken: string })?.accessToken;
//     const id = (session?.data?.user as { id: string })?.id;

//     const [formData, setFormData] = useState({
//         fullName: "",
//         userName: "",
//         email: "",
//         phone: "",
//         dob: null as Date | null,
//         gender: "",
//         address: "",
//     });


//     // Fetch user data
//     const { data, isLoading } = useQuery<UserProfileResponse>({
//         queryKey: ["me"],
//         queryFn: async () => {
//             const res = await fetch(
//                 `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             if (!res.ok) throw new Error("Failed to fetch user");
//             return res.json();
//         },
//         enabled: !!token,
//     });


//     // Populate form with API data
//     useEffect(() => {
//         if (data?.data) {
//             const user = data.data;
//             setFormData({
//                 fullName: user.name || "",
//                 userName: user._id.slice(0, 6), // adjust if you have real username
//                 email: user.email || "",
//                 phone: user.phoneNumber || "",
//                 dob: user.createdAt ? new Date(user.createdAt) : null, // replace with real dob if available
//                 gender: "male", // replace if your API has gender
//                 address: "Not provided", // replace if your API has address
//             });
//         }
//     }, [data]);


//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSave = () => {
//         console.log("Form Data:", formData);
//         setIsEditing(false);
//     };

//     const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setAvatar(e.target.files[0]);
//         }
//     };

//     const handleUploadAvatar = () => {
//         if (avatar) {
//             console.log("Selected Avatar File:", avatar);
//             setAvatar(null);
//         }
//     };

//     return (
//         <div className="p-6 mx-auto rounded-md min-h-screen">
//             {/* Header */}
//             <div className="pb-7 mb-6">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h1 className="text-2xl font-bold text-[#595959] mb-1">Setting</h1>
//                         <div className="flex items-center space-x-2 text-sm">
//                             <Link href="/dashboard" className="text-gray-500 text-base hover:text-gray-700 transition-colors">
//                                 Dashboard
//                             </Link>
//                             <span className="text-gray-400">›</span>
//                             <span className="text-gray-500 text-base">Setting</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Avatar & Actions */}
//             <div className="flex items-center gap-4 mb-6">
//                 <div>
//                     <div className="flex items-center gap-4 mb-6">
//                         <Avatar
//                             className="w-32 h-32 cursor-pointer"
//                             onClick={() => document.getElementById("avatar")?.click()}
//                         >
//                             <AvatarImage
//                                 src={avatar ? URL.createObjectURL(avatar) : "/profile.jpg"}
//                                 alt="Profile"
//                                 className="w-32 h-32 object-cover"
//                             />
//                             <AvatarFallback>MR</AvatarFallback>
//                         </Avatar>

//                         <div>
//                             <h2 className="text-lg font-semibold">{formData.fullName}</h2>
//                             <p className="text-gray-500">@{formData.userName}</p>
//                         </div>
//                     </div>

//                     {/* Hidden file input */}
//                     <input
//                         type="file"
//                         id="avatar"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handleAvatarChange}
//                     />

//                     {/* Upload button */}
//                     {avatar && (
//                         <Button
//                             onClick={handleUploadAvatar}
//                             className=" ml-0 text-sm bg-btnPrimary hover:bg-btnPrimary/80 text-white"
//                         >
//                             Upload Avatar
//                         </Button>
//                     )}
//                 </div>

//                 {/* Action buttons */}
//                 <div className="ml-auto flex gap-3">
//                     {!isEditing && (
//                         <Button
//                             variant="outline"
//                             onClick={() => setIsEditing(true)}
//                             className="px-4 py-2 bg-btnPrimary hover:bg-btnPrimary/80 hover:text-white text-white"
//                         >
//                             <PencilIcon /> Update Profile
//                         </Button>
//                     )}
//                     {isEditing && (
//                         <Button
//                             onClick={handleSave}
//                             className="px-4 py-2 bg-btnPrimary hover:bg-btnPrimary/80 hover:text-white text-white"
//                         >
//                             <Save /> Save
//                         </Button>
//                     )}
//                 </div>
//             </div>

//             {/* Form */}
//             <div className="grid grid-cols-2 gap-6">
//                 <div>
//                     <label className="block text-sm text-gray-600 mb-2">Full Name</label>
//                     <Input
//                         name="fullName"
//                         value={formData.fullName}
//                         disabled={!isEditing}
//                         onChange={handleChange}
//                         className="w-full py-5 px-4 border border-[#0000001A]"
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm text-gray-600 mb-2">User Name</label>
//                     <Input
//                         name="userName"
//                         value={formData.userName}
//                         disabled={!isEditing}
//                         onChange={handleChange}
//                         className="w-full py-5 px-4 border border-[#0000001A]"
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm text-gray-600 mb-2">Email</label>
//                     <Input
//                         name="email"
//                         value={formData.email}
//                         disabled
//                         className="w-full py-5 px-4 border border-[#0000001A] bg-gray-100"
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
//                     <Input
//                         name="phone"
//                         value={formData.phone}
//                         disabled={!isEditing}
//                         onChange={handleChange}
//                         className="w-full py-5 px-4 border border-[#0000001A]"
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm text-gray-600 mb-2">Date of Birth</label>
//                     <Popover>
//                         <PopoverTrigger asChild>
//                             <Button
//                                 variant="outline"
//                                 className="w-full py-5 px-4 text-left border border-[#0000001A] justify-start"
//                                 disabled={!isEditing}
//                             >
//                                 {formData.dob ? format(formData.dob, "PPP") : "Select date"}
//                             </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0">
//                             <Calendar
//                                 mode="single"
//                                 selected={formData.dob}
//                                 onSelect={(date) => date && setFormData({ ...formData, dob: date })}
//                             />
//                         </PopoverContent>
//                     </Popover>
//                 </div>

//                 <div>
//                     <label className="block text-sm text-gray-600 mb-2">Gender</label>
//                     <select
//                         name="gender"
//                         value={formData.gender}
//                         disabled={!isEditing}
//                         onChange={handleChange}
//                         className="w-full py-2 px-4 border border-[#0000001A] text-gray-700 rounded"
//                     >
//                         <option value="">Select Gender</option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                         <option value="other">Other</option>
//                     </select>
//                 </div>

//                 <div className="col-span-2">
//                     <label className="block text-sm text-gray-600 mb-2">Address</label>
//                     <Input
//                         name="address"
//                         value={formData.address}
//                         disabled={!isEditing}
//                         onChange={handleChange}
//                         className="w-full py-5 px-4 border border-[#0000001A]"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, PencilIcon, Save } from "lucide-react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { UserProfileResponse } from "../../../../../../types/userDataType";
import { toast } from "sonner";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const session = useSession();
    const queryClient = useQueryClient();

    const token = (session?.data?.user as { accessToken: string })?.accessToken;

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        dob: null as Date | null,
        address: "",
    });

    // Fetch user data
    const { data, isLoading } = useQuery<UserProfileResponse>({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Failed to fetch user");
            return res.json();
        },
        enabled: !!token,
    });

    console.log(isLoading)
    // Populate form with API data
    useEffect(() => {
        if (data?.data) {
            const user = data.data;
            setFormData({
                fullName: user.name || "",
                email: user.email || "",
                phone: user.phoneNumber || "",
                dob: user.dateOfBirth ? new Date(user.dateOfBirth) : null,

                address: user.addressLine1 || "",
            });
        }
    }, [data]);

    // Profile update mutation
    const profileMutation = useMutation({
        mutationFn: async (payload: { name: string, phoneNumber: string, dateOfBirth: string }) => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );
            const resData = await response.json();
            if (!response.ok) throw new Error(resData.message || "Failed to update profile");
            return resData;
        },
        onSuccess: () => {
            toast.success("Profile updated successfully");
            queryClient.invalidateQueries({ queryKey: ["me"] });
            setIsEditing(false);
        },
        onError: (error) => {
            toast.error(error.message || "Update failed");
        },
    });

    // Avatar upload mutation
    const avatarMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("profileImage", file);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/upload-avatar`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );
            const resData = await response.json();
            if (!response.ok) throw new Error(resData.message || "Failed to upload image");
            return resData;
        },
        onSuccess: () => {
            toast.success("Avatar updated successfully");
            queryClient.invalidateQueries({ queryKey: ["me"] });
            setAvatar(null);
        },
        onError: (error) => {
            toast.error(error.message || "Image upload failed");
        },
    });

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const payload = {
            name: formData.fullName,
            phoneNumber: formData.phone,
            dateOfBirth: formData.dob ? formData.dob.toISOString() : "",
            addressLine1: formData.address
        };
        console.log(formData)
        profileMutation.mutate(payload);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(e.target.files[0]);
        }
    };

    const handleUploadAvatar = () => {
        if (avatar) {
            avatarMutation.mutate(avatar);
        } else {
            toast.error("Please select an image first.");
        }
    };

    return (
        <div className="p-6 mx-auto rounded-md min-h-screen">
            {/* Header */}
            <div className="pb-7 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#595959] mb-1">Setting</h1>
                        <div className="flex items-center space-x-2 text-sm">
                            <Link
                                href="/dashboard"
                                className="text-gray-500 text-base hover:text-gray-700 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <span className="text-gray-400">›</span>
                            <span className="text-gray-500 text-base">Setting</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Avatar & Actions */}
            <div className="flex items-center gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar
                            className="w-32 h-32 cursor-pointer"
                            onClick={() => document.getElementById("avatar")?.click()}
                        >
                            <AvatarImage
                                src={
                                    avatar
                                        ? URL.createObjectURL(avatar)
                                        : data?.data?.profileImage || "/profile.jpg"
                                }
                                alt="Profile"
                                className="w-32 h-32 object-cover"
                            />
                            <AvatarFallback>{formData.fullName.slice(0, 2)}</AvatarFallback>
                        </Avatar>

                        <div>
                            <h2 className="text-lg font-semibold">{formData.fullName}</h2>
                        </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        id="avatar"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />

                    {/* Upload button */}
                    {avatar && (
                        <Button
                            onClick={handleUploadAvatar}
                            className="ml-0 text-sm bg-btnPrimary hover:bg-btnPrimary/80 text-white"
                        >
                            Upload Avatar {avatarMutation.isPending && <Loader2 className="animate-spin mr-2" />}
                        </Button>
                    )}
                </div>

                {/* Action buttons */}
                <div className="ml-auto flex gap-3">
                    {!isEditing && (
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-btnPrimary hover:bg-btnPrimary/80 hover:text-white text-white"
                        >
                            <PencilIcon /> Update Profile
                        </Button>
                    )}
                    {isEditing && (
                        <Button
                            onClick={handleSave}
                            className="px-4 py-2 bg-btnPrimary hover:bg-btnPrimary/80 hover:text-white text-white"
                        >
                            <Save /> Save
                        </Button>
                    )}
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                    <Input
                        name="fullName"
                        value={formData.fullName}
                        disabled={!isEditing}
                        onChange={handleChange}
                        className="w-full py-5 px-4 border border-[#0000001A]"
                    />
                </div>


                <div>
                    <label className="block text-sm text-gray-600 mb-2">Email</label>
                    <Input
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full py-5 px-4 border border-[#0000001A] bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
                    <Input
                        name="phone"
                        value={formData.phone}
                        disabled={!isEditing}
                        onChange={handleChange}
                        className="w-full py-5 px-4 border border-[#0000001A]"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-2">Date of Birth</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full py-5 px-4 text-left border border-[#0000001A] justify-start"
                                disabled={!isEditing}
                            >
                                {formData.dob ? format(formData.dob, "PPP") : "Select date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={formData.dob || undefined}
                                onSelect={(date) => date && setFormData({ ...formData, dob: date })}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm text-gray-600 mb-2">Address</label>
                    <Input
                        name="address"
                        value={formData.address}
                        disabled={!isEditing}
                        onChange={handleChange}
                        className="w-full py-5 px-4 border border-[#0000001A]"
                    />
                </div>
            </div>
        </div>
    );
}
