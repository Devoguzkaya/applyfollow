"use client";

import MyCv from "@/components/MyCv";
import CvBuilder from "@/components/CvBuilder";
import { useState } from "react";

export default function MyCvPage() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-white tracking-tight">
                        {isEditing ? "CV Builder" : "My CV"}
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {isEditing
                            ? "Craft your professional profile to stand out to recruiters."
                            : "Preview your professional profile and download it as PDF."}
                    </p>
                </div>

                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold border border-white/10 transition-all group"
                >
                    <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">
                        {isEditing ? "visibility" : "edit"}
                    </span>
                    {isEditing ? "View Preview" : "Edit CV Content"}
                </button>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                {isEditing ? <CvBuilder /> : <MyCv />}
            </div>
        </div>
    );
}
