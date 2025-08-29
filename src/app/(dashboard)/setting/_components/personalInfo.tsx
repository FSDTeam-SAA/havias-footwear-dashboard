// "use client";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { PencilIcon, Save } from "lucide-react";
// import { format } from "date-fns";
// import Link from "next/link";
// import React, { useState } from "react";

// export default function ProfilePage() {
//     const [isEditing, setIsEditing] = useState(false);
//     const [avatar, setAvatar] = useState<File | null>(null);
//     const [formData, setFormData] = useState({
//         fullName: "Mr. Raja",
//         userName: "raja123",
//         email: "raja123@gmail.com",
//         phone: "+1 (888) 000-0000",
//         dob: new Date("2001-04-15"),
//         gender: "Male",
//         address: "00000 Artesia Blvd, Suite A-000",
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
//             console.log("Avatar File:", avatar);
//         }
//     };

//     return (
//         <div className="p-6 mx-auto rounded-md min-h-screen">
//             {/* Header */}
//             <div className="pb-7 mb-6">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h1 className="text-2xl font-bold text-[#595959] mb-1">Profile Settings</h1>
//                         <div className="flex items-center space-x-2 text-sm">
//                             <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
//                             <span className="text-gray-400">›</span>
//                             <span className="text-gray-500">Profile</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Avatar */}
//             <div className="flex items-center gap-4 mb-6">
//                 <div >

//                     <div className="flex items-center gap-4 mb-6">
//                         <Avatar className="w-32 h-32">
//                             <AvatarImage
//                                 src="/profile.jpg"
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
//                     <div className="mt-6">
//                         <label className="block text-sm text-gray-600">Upload Avatar</label>
//                         <input
//                             type="file"
//                             id="avatar"
//                             className="hidden"
//                             onChange={handleAvatarChange}
//                         />
//                         <Button
//                             onClick={() => document.getElementById("avatar")?.click()}
//                             className="mt-2 text-sm text-blue-600"
//                         >
//                             Choose Avatar
//                         </Button>
//                         {avatar && (
//                             <Button
//                                 onClick={handleUploadAvatar}
//                                 className="mt-2 ml-2 text-sm bg-gray-700 text-white"
//                             >
//                                 Upload Avatar
//                             </Button>
//                         )}
//                     </div>
//                 </div>


//                 <div className="ml-auto flex gap-3">
//                     {!isEditing && (
//                         <Button
//                             variant="outline"
//                             onClick={() => setIsEditing(true)}
//                             className="px-4 py-2 bg-btnPrimary hover:bg-btnPrimary/80 text-white"
//                         >
//                             <PencilIcon /> Update Profile
//                         </Button>
//                     )}
//                     {isEditing && (
//                         <Button
//                             onClick={handleSave}
//                             className="px-4 py-2 bg-btnPrimary hover:bg-btnPrimary/80 text-white"
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
//                         className="w-full py-5 px-4 border border-[#0000001A] bg-gray-100 cursor-not-allowed"
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

//                 {/* Date of Birth */}
//                 <div>
//                     <label className="block text-sm text-gray-600 mb-2">Date of Birth</label>
//                     <Popover>
//                         <PopoverTrigger asChild>
//                             <Button
//                                 variant="outline"
//                                 className="w-full py-5 px-4 text-left border border-[#0000001A] justify-start"
//                                 disabled={!isEditing} // disable button if not editing
//                             >
//                                 {formData.dob ? format(formData.dob, "PPP") : "Select date"}
//                             </Button>
//                         </PopoverTrigger>
//                         {isEditing && ( // only show calendar if editing
//                             <PopoverContent className="w-auto p-0">
//                                 <Calendar
//                                     mode="single"
//                                     selected={formData.dob}
//                                     onSelect={(date) => date && setFormData({ ...formData, dob: date })}
//                                 />
//                             </PopoverContent>
//                         )}
//                     </Popover>
//                 </div>


//                 {/* Gender */}
//                 <div>
//                     <label className="block text-sm text-gray-600 mb-2">Gender</label>
//                     <Select
//                         disabled={!isEditing}
//                         value={formData.gender}
//                         onValueChange={(value) => setFormData({ ...formData, gender: value })}
//                     >
//                         <SelectTrigger className="w-full py-5 px-4 border border-[#0000001A] text-gray-700">
//                             <SelectValue placeholder="Select Gender" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="Male">Male</SelectItem>
//                             <SelectItem value="Female">Female</SelectItem>
//                             <SelectItem value="Other">Other</SelectItem>
//                         </SelectContent>
//                     </Select>
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

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilIcon, Save } from "lucide-react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        fullName: "Mr. Raja",
        userName: "raja123",
        email: "raja123@gmail.com",
        phone: "+1 (888) 000-0000",
        dob: new Date("2001-04-15"),
        gender: "male",
        address: "00000 Artesia Blvd, Suite A-000",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        console.log("Form Data:", formData);
        setIsEditing(false);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(e.target.files[0]);
        }
    };

    const handleUploadAvatar = () => {
        if (avatar) {
            console.log("Selected Avatar File:", avatar);
            // optionally update formData or send to backend
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
                            <Link href="/dashboard" className="text-gray-500 text-base hover:text-gray-700 transition-colors">
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
                                src={avatar ? URL.createObjectURL(avatar) : "/profile.jpg"}
                                alt="Profile"
                                className="w-32 h-32 object-cover"
                            />
                            <AvatarFallback>MR</AvatarFallback>
                        </Avatar>

                        <div>
                            <h2 className="text-lg font-semibold">{formData.fullName}</h2>
                            <p className="text-gray-500">@{formData.userName}</p>
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
                            className=" ml-0 text-sm bg-btnPrimary hover:bg-btnPrimary/80 text-white"
                        >
                            Upload Avatar
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
                    <label className="block text-sm text-gray-600 mb-2">User Name</label>
                    <Input
                        name="userName"
                        value={formData.userName}
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
                                selected={formData.dob}
                                onSelect={(date) => date && setFormData({ ...formData, dob: date })}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-2">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        disabled={!isEditing}
                        onChange={handleChange}
                        className="w-full py-2 px-4 border border-[#0000001A] text-gray-700 rounded"
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
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
