"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCv, downloadCv } from '@/store/features/cv/cvSlice';
import CvPreview from './CvPreview';

interface MyCvProps {
    setIsEditing: (value: boolean) => void;
}

export default function MyCv({ setIsEditing }: MyCvProps) {
    const dispatch = useAppDispatch();
    const { data, isLoading } = useAppSelector((state) => state.cv);
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // Fetch CV data if not already available
        if (!data) {
            dispatch(fetchCv());
        }
    }, [dispatch, data]);

    const handleDownload = async () => {
        try {
            await dispatch(downloadCv()).unwrap();
        } catch (error) {
            // Toast managed in slice or component
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            </div>
        );
    }

    // Prepare default user for type safety if needed (although selector should provide it)
    const displayUser = user || {
        fullName: "Your Name",
        email: "email@example.com"
    };

    // If data is null, CvPreview handles it, but we can prevent passing null data by handling loading
    // Actually CvPreview returns the empty state if data is missing or empty.

    // We need to cast data to CvData or handle null. 
    // The slice state defines data as CvData | null. CvPreview expects CvData (required).
    // Let's pass null if data is null, but we need to update CvPreview prop type or pass default.
    // However, CvPreview renders "No CV Found" if data is missing.
    // Let's cast or default.

    // Better: let's update CvPreview to allow data to be null.
    // I can't easily change previous file without another call.
    // So let's pass a dummy empty object if null, and let CvPreview detailed check handle it.

    const safeData = data || {
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
