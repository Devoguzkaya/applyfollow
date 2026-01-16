'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminService, UserAdminResponse } from '@/services/adminService';
import { ApplicationResponse } from '@/services/applicationService';
import { CvData } from '@/services/cvService';
import Link from 'next/link';

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [activeTab, setActiveTab] = useState<'applications' | 'cv' | 'overview'>('overview');
    const [loading, setLoading] = useState(true);

    // Data States
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
            const [appsData, cvDataRes] = await Promise.all([
                adminService.getUserApplications(userId).catch(() => []), // Fail nicely if empty
                adminService.getUserCv(userId).catch(() => null)
            ]);

            setApplications(appsData);
            setCvData(cvDataRes);
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

    if (loading) return <div className="p-8 text-center">Loading user details...</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href="/admin/users" className="text-gray-500 hover:text-gray-700 text-sm mb-2 inline-block">← Back to Users</Link>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">User Details <span className='text-sm font-normal text-gray-500'>({userId})</span></h1>
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
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`${activeTab === 'applications' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Applications ({applications.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('cv')}
                        className={`${activeTab === 'cv' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        CV / Resume
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">

                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">User Stats</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                                <span className="block text-sm text-blue-500 dark:text-blue-300">Total Applications</span>
                                <span className="block text-2xl font-bold text-blue-700 dark:text-blue-100">{applications.length}</span>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                                <span className="block text-sm text-green-500 dark:text-green-300">Has CV?</span>
                                <span className="block text-2xl font-bold text-green-700 dark:text-green-100 text-sm mt-2">{cvData ? 'YES' : 'NO'}</span>
                            </div>
                            {/* More stats can go here */}
                        </div>
                    </div>
                )}

                {activeTab === 'applications' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Company</th>
                                    <th className="px-4 py-2 text-left">Position</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Date Applied</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.length === 0 ? (
                                    <tr><td colSpan={4} className="p-4 text-center text-gray-500">No applications found.</td></tr>
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
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Curriculum Vitae</h2>
                            {cvData && (
                                <button
                                    onClick={handleDownloadCv}
                                    disabled={downloading}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition flex items-center gap-2"
                                >
                                    {downloading ? 'Downloading...' : 'Download Word CV'}
                                </button>
                            )}
                        </div>

                        {!cvData ? (
                            <p className="text-gray-500 italic">User has not created a CV yet.</p>
                        ) : (
                            <div className="space-y-6 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><strong>Phone:</strong> {cvData.phoneNumber || '-'}</div>
                                    <div><strong>LinkedIn:</strong> {cvData.linkedinUrl || '-'}</div>
                                    <div className="col-span-2"><strong>Summary:</strong> <p className="mt-1 text-gray-600 dark:text-gray-300">{cvData.summary || '-'}</p></div>
                                </div>
                                <hr />
                                <div>
                                    <h3 className="font-semibold mb-2">Education</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {cvData.educations.map((edu, idx) => (
                                            <li key={idx}>
                                                <span className="font-medium">{edu.schoolName}</span> - {edu.fieldOfStudy} ({edu.startDate ? new Date(edu.startDate).getFullYear() : '?'} - {edu.isCurrent ? 'Present' : (edu.endDate ? new Date(edu.endDate).getFullYear() : '?')})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Experience</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {cvData.experiences.map((exp, idx) => (
                                            <li key={idx}>
                                                <span className="font-medium">{exp.position}</span> at {exp.companyName}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
