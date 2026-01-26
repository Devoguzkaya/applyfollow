"use client";

import { useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { cvService } from '@/services/cvService';
import CvPreview from './CvPreview';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';

interface MyCvProps {
    setIsEditing: (value: boolean) => void;
}

export default function MyCv({ setIsEditing }: MyCvProps) {
    const { user } = useAppSelector((state) => state.auth);

    // Fetch CV data using TanStack Query
    const { data, isLoading } = useQuery({
        queryKey: ['cv'],
        queryFn: cvService.getCv
    });

    // PDF Download (Server-Side with Puppeteer)
    const componentRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!componentRef.current) {
            toast.error("Preview not ready");
            return;
        }

        const toastId = toast.loading('Generating High-Quality PDF...');

        try {
            // Extract HTML
            const htmlContent = componentRef.current?.innerHTML || '';

            // Call backend API
            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    html: htmlContent,
                    themeConfig: {
                        primary: '#17cf63',
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Server failed to generate PDF');
            }

            // Handle Blob
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const filename = `CV_${user?.fullName?.replace(/\s+/g, '_') || 'My_CV'}.pdf`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('PDF Downloaded!', { id: toastId });

        } catch (error) {
            console.error("PDF Error:", error);
            toast.error('Failed to generate PDF. Please try again.', { id: toastId });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            </div>
        );
    }

    const displayUser = user || {
        fullName: "Your Name",
        email: "email@example.com"
    };

    const safeData = data || {
        id: '',
        educations: [],
        experiences: [],
        skills: [],
        languages: [],
        certificates: []
    };

    return (
        <div ref={componentRef} className="print:m-0 print:p-0 print:w-[210mm] print:h-[297mm]">
            <CvPreview
                data={safeData}
                user={displayUser}
                onEdit={() => setIsEditing(true)}
                onDownload={handleDownload}
            />
        </div>
    );
}
