import React, { useState, useEffect } from 'react';
import { getReports, updateReport } from '../services/reportService';
import type { ReportWithId } from '../types';
import { ReportType, ProjectIssueType } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

import allRegions from '../regions.json' with { type: 'json' };
import allProvinces from '../provinces.json' with { type: 'json' };
import allCities from '../cities.json' with { type: 'json' };

const regionMap = new Map(allRegions.map(r => [r.id, r.reg_desc]));
const provinceMap = new Map(allProvinces.map(p => [p.id, p.prov_desc]));
const cityMap = new Map(allCities.map(c => [c.id.toString(), c.citymunDesc]));

const getLocationString = (report: ReportWithId): string => {
    const region = regionMap.get(report.regionId) || 'Unknown Region';
    const province = provinceMap.get(report.provinceId) || 'Unknown Province';
    const city = cityMap.get(report.cityId) || 'Unknown City';
    return `${city}, ${province}, ${region}`;
};

interface AdminViewProps {
    onBack: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onBack }) => {
    const [reports, setReports] = useState<ReportWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const fetchedReports = await getReports();
                setReports(fetchedReports);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch reports. You may not have admin permissions.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handlePublish = async (reportId: string) => {
        try {
            await updateReport(reportId, { isPublic: true });
            const fetchedReports = await getReports(); // Re-fetch to get the latest state
                setReports(fetchedReports);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch reports. You may not have admin permissions.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Loading Reports...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button onClick={onBack} className="text-red-600 dark:text-red-400 hover:underline">Back to App</button>
            </div>
            <div className="space-y-6">
                {reports.length === 0 ? (
                    <p className="text-center text-slate-500">No reports have been submitted yet.</p>
                ) : (
                    reports.map(report => (
                        <div key={report.id} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                    {report.reportType === ReportType.PROJECT ? report.projectName : report.politicianName}
                                </h2>
                                <div className="flex items-center space-x-4">
                                    {!report.isPublic && (
                                        <button onClick={() => handlePublish(report.id)} className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Publish</button>
                                    )}
                                    <span className="text-xs text-slate-400">{new Date(report.createdAt.seconds * 1000).toLocaleString()}</span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{getLocationString(report)}</p>
                            <div className="mt-2 p-3 bg-white dark:bg-slate-800 rounded">
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{report.description}</p>
                            </div>
                            {report.reportType === ReportType.PROJECT && (
                                <p className="text-xs mt-2 text-slate-500">
                                    Issue Type: <span className="font-semibold">{ProjectIssueType[report.projectIssueType as keyof typeof ProjectIssueType]}</span>
                                </p>
                            )}
                             {report.reportType === ReportType.POLITICIAN && report.position && (
                                <p className="text-xs mt-2 text-slate-500">
                                    Position: <span className="font-semibold">{report.position}</span>
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};