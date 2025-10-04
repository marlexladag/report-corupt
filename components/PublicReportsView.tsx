import React, { useState, useEffect } from 'react';
import { getPublicReports } from '../services/reportService';
import { useAuth } from '../context/AuthContext';
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

interface PublicReportsViewProps {
    onBack?: () => void;
}

export const PublicReportsView: React.FC<PublicReportsViewProps> = ({ onBack }) => {
    const [reports, setReports] = useState<ReportWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const fetchedReports = await getPublicReports();
                setReports(fetchedReports);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch reports.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Loading Public Reports...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    return (
        <div>
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Public Reports</h1>
                    {onBack && (
                        <button onClick={onBack} className="text-sm font-semibold text-red-600 dark:text-red-400 hover:underline">
                            {currentUser ? 'Back to App' : 'Back to Home'}
                        </button>
                    )}
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Vetted reports submitted by citizens.</p>
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/25 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-200 rounded-r-lg">
                    <h3 className="font-bold">Demonstration Notice</h3>
                    <p className="text-sm">The project data presented in this application is for demonstration purposes only and does not represent real government projects.</p>
                </div>
            </div>

            <div className="space-y-6">
                {reports.length === 0 ? (
                    <p className="text-center text-slate-500">No public reports are available at this time.</p>
                ) : (
                    reports.map(report => (
                        <div key={report.id} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                    {report.reportType === ReportType.PROJECT ? report.projectName : report.politicianName}
                                </h2>
                                <span className="text-xs text-slate-400">{new Date(report.createdAt.seconds * 1000).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{getLocationString(report)}</p>
                            <div className="mt-2 p-3 bg-white dark:bg-slate-800 rounded">
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{report.description}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};