"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Title from "../../_components/Title";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

export default function AddCategories() {
    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");

    const handleSave = () => {
        console.log("Category Name:", categoryName);
        console.log("Description:", description);
    };

    return (
        <div className="container mx-auto p-6">
            <Title title="Add Categories" active="Dashboard > Categories > Add Categories" />
            <Card className="mt-10 shadow-none bg-transparent border-none">
                <CardHeader>
                    <CardTitle className="text-[#272727] font-semibold text-[20px] mb-2">General Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2 ">
                            <label className="text-sm font-medium text-[#595959]">Category Name</label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Type category name here..."
                                className="w-full border border-gray-300 bg-transparent rounded-md py-3 px-3  "
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Type category description here..."
                                className="w-full border border-gray-300 min-h-[120px] p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="w-full flex  justify-end">
                            <Button onClick={handleSave} className="mt-4 bg-btnPrimary hover:bg-btnPrimary/60">
                                <Save />   Save
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}