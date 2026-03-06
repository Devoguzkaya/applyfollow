"use client";

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from "@/context/LanguageContext";

interface StatusSelectProps {
    value: string;
    onChange: (newValue: string) => void;
    disabled?: boolean;
}

const statusOptions = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'GHOSTED'] as const;
export type ApplicationStatus = typeof statusOptions[number];

export default function StatusSelect({ value, onChange, disabled }: StatusSelectProps) {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const styles: Record<string, string> = {
        'APPLIED': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        'INTERVIEW': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        'OFFER': 'text-primary bg-primary/10 border-primary/20',
        'REJECTED': 'text-red-400 bg-red-500/10 border-red-500/20',
        'GHOSTED': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    };

    const activeStyle = styles[value] || styles['APPLIED'];

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative group/status w-fit ${disabled ? 'opacity-50 cursor-wait' : ''}`} ref={dropdownRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between gap-2 appearance-none bg-transparent border rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider cursor-pointer outline-none focus:ring-1 focus:ring-primary transition-all pr-2 ${activeStyle} min-w-[110px]`}
            >
                <span>{t(`applications.status.${value}`) || value}</span>
                {disabled ? (
                    <span className="size-3 border-2 border-primary/50 border-t-primary rounded-full animate-spin"></span>
                ) : (
                    <span className={`material-symbols-outlined text-[14px] pointer-events-none opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
                )}
            </button>

            {isOpen && !disabled && (
                <div className="absolute z-50 mt-1 w-full min-w-[130px] rounded-md border border-border-main bg-surface-card shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <ul className="py-1">
                        {statusOptions.map((status) => (
                            <li key={status}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(status);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-surface-hover ${value === status ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text-main'
                                        }`}
                                >
                                    {t(`applications.status.${status}`) || status}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
