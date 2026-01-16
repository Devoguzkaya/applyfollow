'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminService, UserAdminResponse, AdminUserDetailResponse } from '@/services/adminService';
import { ApplicationResponse } from '@/services/applicationService';
import { CvData } from '@/services/cvService';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import CvPreview from '@/components/CvPreview';

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;
    const { dict } = useLanguage();

    const [activeTab, setActiveTab] = useState<'applications' | 'cv' | 'overview'>('overview');
    const [loading, setLoading] = useState(true);

    // Data States
    const [userDetails, setUserDetails] = useState<AdminUserDetailResponse | null>(null);
    const [applications, setApplications] = useState<ApplicationResponse[]>([]);
    const [cvData, setCvData] = useState<CvData | null>(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (userId) {
            loadData();
        }
    }, [userId]);

    const loadData = async () => {
        try {
            // Load all data in parallel
            // Note: We log any errors specifically for CV to debug access issues
            const [userRes, appsData] = await Promise.all([
                adminService.getUserDetails(userId),
                adminService.getUserApplications(userId).catch(() => []),
            ]);

            setUserDetails(userRes);
            setApplications(appsData);

            // Fetch CV separately to better handle logging
            try {
                const cvDataRes = await adminService.getUserCv(userId);
                console.log("CV Data Loaded:", cvDataRes); // Debug log
                setCvData(cvDataRes);
            } catch (cvError) {
                console.warn("Could not load CV data (might be empty or unauthorized):", cvError);
                setCvData(null);
            }

        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadCv = async () => {
        try {
            setDownloading(true);
            await adminService.downloadUserCv(userId);
        } catch (error) {
            console.error('Error downloading CV:', error);
            alert('Failed to download CV');
        } finally {
            setDownloading(false);
        }
    };

    const calculateCvScore = (data: CvData | null): { score: number, breakdown: string } => {
        if (!data) return { score: 0, breakdown: "No Data" };
        let score = 0;
        let reasons: string[] = [];

        // Summary: 10 pts
        // Reduced threshold to 10 chars for easier testing
        if (data.summary && data.summary.trim().length > 10) {
            score += 10;
            reasons.push("Summary");
        }

        // Personal Details: 15 pts
        let personalScore = 0;
        if (data.phoneNumber) personalScore += 5;
        if (data.address) personalScore += 5;
        if (data.linkedinUrl || data.githubUrl || data.websiteUrl) personalScore += 5;

        if (personalScore > 0) {
            score += personalScore;
            reasons.push(`Details(${personalScore})`);
        }

        // Experiences: 30 pts
        const expCount = data.experiences ? data.experiences.length : 0;
        if (expCount > 0) {
            let pts = 20;
            if (expCount > 1) pts += 10;
            score += pts;
            reasons.push(`Exp(${pts})`);
        }

        // Education: 25 pts
        const eduCount = data.educations ? data.educations.length : 0;
        if (eduCount > 0) {
            let pts = 15;
            if (eduCount > 1) pts += 10;
            score += pts;
            reasons.push(`Edu(${pts})`);
        }

        // Skills: 10 pts
        if (data.skills && data.skills.length > 0) {
            score += 10;
            reasons.push("Skills");
        };

        // Languages: 5 pts
        if (data.languages && data.languages.length > 0) {
            score += 5;
            reasons.push("Lang");
        }

        // Certificates: 5 pts
        if (data.certificates && data.certificates.length > 0) {
            score += 5;
            reasons.push("Cert");
        }

        return { score: Math.min(score, 100), breakdown: reasons.join(", ") };
    };

    const { score: cvScore, breakdown: scoreBreakdown } = calculateCvScore(cvData);

    if (loading) return <div className="p-8 text-center">{dict.admin.detail.loading}</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href="/admin/users" className="text-gray-500 hover:text-gray-700 text-sm mb-2 inline-block">← {dict.admin.detail.back}</Link>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{dict.admin.detail.title} <span className="text-lg font-normal text-gray-500 ml-2">({userDetails?.email || userId})</span></h1>
                </div>
                <div className="space-x-2">
                    {/* Add User Action buttons here if needed */}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        {dict.admin.detail.tabs.overview}
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`${activeTab === 'applications' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        {dict.admin.detail.tabs.applications} ({applications.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('cv')}
                        className={`${activeTab === 'cv' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        {dict.admin.detail.tabs.cv}
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">

                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Profile Information Section */}
                        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2">{dict.admin.detail.profile.title}</h3>
                                    <div className="space-y-3 text-sm">
                                        <p><span className="font-semibold text-gray-600 dark:text-gray-400 w-32 inline-block">{dict.admin.detail.profile.fullName}:</span> <span className="text-gray-800 dark:text-gray-200">{userDetails?.fullName}</span></p>
                                        <p><span className="font-semibold text-gray-600 dark:text-gray-400 w-32 inline-block">{dict.admin.detail.profile.email}:</span> <span className="text-gray-800 dark:text-gray-200">{userDetails?.email}</span></p>
                                        <p><span className="font-semibold text-gray-600 dark:text-gray-400 w-32 inline-block">{dict.admin.detail.profile.role}:</span> <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${userDetails?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>{userDetails?.role}</span></p>
                                        <p><span className="font-semibold text-gray-600 dark:text-gray-400 w-32 inline-block">{dict.admin.detail.profile.active}:</span> <span className={`${userDetails?.active ? 'text-green-600' : 'text-red-600'} font-medium`}>{userDetails?.active ? dict.admin.table.active : dict.admin.table.inactive}</span></p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2">{dict.admin.detail.profile.address} / {dict.admin.detail.profile.phone}</h3>
                                    <div className="space-y-3 text-sm">
                                        <p><span className="font-semibold text-gray-600 dark:text-gray-400 w-32 inline-block">{dict.admin.detail.profile.phone}:</span> <span className="text-gray-800 dark:text-gray-200">{userDetails?.phoneNumber || dict.admin.detail.profile.notProvided}</span></p>
                                        <p><span className="font-semibold text-gray-600 dark:text-gray-400 w-32 inline-block">{dict.admin.detail.profile.address}:</span> <span className="text-gray-800 dark:text-gray-200">{userDetails?.address || dict.admin.detail.profile.notProvided}</span></p>
                                        {userDetails?.linkedinUrl && <p><span className="font-semibold text-gray-600 dark:text-gray-400 w-32 inline-block">LinkedIn:</span> <a href={userDetails.linkedinUrl} target="_blank" className="text-indigo-600 hover:underline">View Profile</a></p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">{dict.admin.detail.stats.title}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                                    <span className="block text-sm text-blue-500 dark:text-blue-300">{dict.admin.detail.stats.totalApps}</span>
                                    <span className="block text-2xl font-bold text-blue-700 dark:text-blue-100">{applications.length}</span>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                                    <span className="block text-sm text-green-500 dark:text-green-300">{dict.admin.detail.stats.hasCv}</span>
                                    <span className="block text-2xl font-bold text-green-700 dark:text-green-100 text-sm mt-2">{cvData ? dict.admin.detail.stats.yes : dict.admin.detail.stats.no}</span>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg cursor-help group" title={scoreBreakdown || "No specific details"}>
                                    <span className="block text-sm text-purple-500 dark:text-purple-300">{dict.admin.detail.stats.cvScore}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="block text-2xl font-bold text-purple-700 dark:text-purple-100">%{cvScore}</span>
                                        <div className="w-16 h-2 bg-purple-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-600 transition-all duration-1000" style={{ width: `${cvScore}%` }}></div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-purple-400 mt-1 opacity-60 truncate">{scoreBreakdown}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'applications' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">{dict.admin.detail.apps.company}</th>
                                    <th className="px-4 py-2 text-left">{dict.admin.detail.apps.position}</th>
                                    <th className="px-4 py-2 text-left">{dict.admin.detail.apps.status}</th>
                                    <th className="px-4 py-2 text-left">{dict.admin.detail.apps.date}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.length === 0 ? (
                                    <tr><td colSpan={4} className="p-4 text-center text-gray-500">{dict.admin.detail.apps.empty}</td></tr>
                                ) : (
                                    applications.map(app => (
                                        <tr key={app.id}>
                                            <td className="px-4 py-2">{app.company.name}</td>
                                            <td className="px-4 py-2 font-medium">{app.position}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded text-xs ${app.status === 'OFFER' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{app.status}</span>
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'cv' && (
                    <div className="relative">
                        {/* Wrapper to add background color similar to MyCv page to ensure preview looks good */}
                        <div className="bg-background-main/5 p-4 rounded-lg">
                            <CvPreview
                                data={cvData || { educations: [], experiences: [], skills: [], languages: [], certificates: [] }}
                                user={{ fullName: userDetails?.fullName || '', email: userDetails?.email || '' }}
                                showActions={false} // Hide header actions inside preview
                                onDownload={undefined} // We have own download button
                                onEdit={undefined} // Admin can't edit
                            />
                        </div>

                        {/* Admin specific action to download */}
                        {cvData && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleDownloadCv}
                                    disabled={downloading}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg shadow transition flex items-center gap-2 font-bold"
                                >
                                    {downloading ? (
                                        <><span className="size-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span> {dict.admin.detail.cv.downloading}</>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[20px]">download</span>
                                            {dict.admin.detail.cv.download}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
