"use client";

import MyCv from "@/components/MyCv";
import CvBuilder from "@/components/CvBuilder";
import { useState } from "react";

export default function MyCvPage() {
    const [isEditing, setIsEditing] = useState(true); // Default to builder view as typically users want to edit first

    return (
        <div className="animate-in fade-in duration-500">
            {isEditing ? (
                <CvBuilder setIsEditing={setIsEditing} />
            ) : (
                <MyCv setIsEditing={setIsEditing} />
            )}
        </div>
    );
}
