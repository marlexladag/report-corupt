import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReportsForUser } from '../services/reportService';
import type { ReportWithId } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ReportType, ProjectIssueType } from '../types';

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

interface UserReportsViewProps {
    onBack: () => void;
}

export const UserReportsView: React.FC<UserReportsViewProps> = ({ onBack }) => {
    const { currentUser } = useAuth();
    const [reports, setReports] = useState<ReportWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser) {
            setError("You must be logged in to view your reports.");
            setLoading(false);
            return;
        }

        const fetchUserReports = async () => {
            try {
                const fetchedReports = await getReportsForUser(currentUser.uid);
                setReports(fetchedReports);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch your reports.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserReports();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Loading Your Reports...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Submitted Reports</h1>
                <button onClick={onBack} className="text-red-600 dark:text-red-400 hover:underline">Back to App</button>
            </div>
            {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</p>}
            <div className="space-y-6">
                {reports.length === 0 && !error ? (
                    <p className="text-center text-slate-500 dark:text-slate-400">You have not submitted any reports yet.</p>
                ) : (
                    reports.map(report => (
                        <div key={report.id} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg shadow">
                            {/* This is a simplified view. You can expand this to show more details similar to AdminView */}
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                {report.reportType === ReportType.PROJECT ? report.projectName || 'Project Report' : report.politicianName || 'Politician Report'}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{getLocationString(report)}</p>
                            <p className="text-xs text-slate-400">Submitted on: {new Date(report.createdAt.seconds * 1000).toLocaleDateString()}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};