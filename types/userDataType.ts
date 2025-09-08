export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    profileImage: string;
    addressLine1: string;
    gender: "male" | "female";
    dateOfBirth: string;
    role: "admin" | "user" | string; // adjust if you have fixed roles
    verified: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
    lastLogin: string; // ISO date string
}

export interface UserProfileResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: UserProfile;
}
