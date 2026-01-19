"use client";

import { useAppSelector } from '@/store/hooks';
import { cvService } from '@/services/cvService';
import CvPreview from './CvPreview';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

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

    const downloadMutation = useMutation({
        mutationFn: cvService.downloadCv,
        onError: () => {
            toast.error("Failed to download CV");
        }
    });

    const handleDownload = async () => {
        downloadMutation.mutate();
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
        <CvPreview
            data={safeData}
            user={displayUser}
            onEdit={() => setIsEditing(true)}
            onDownload={handleDownload}
        />
    );
}
