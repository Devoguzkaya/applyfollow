"use client";

import { useState } from 'react';
import QuickAddModal from './QuickAddModal';

export default function FloatingAddButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 z-40 size-14 bg-primary text-[#101618] rounded-full shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
                aria-label="Hızlı Ekle"
            >
                <span className="material-symbols-outlined text-3xl font-bold group-hover:rotate-90 transition-transform duration-300">add</span>
            </button>

            <QuickAddModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
