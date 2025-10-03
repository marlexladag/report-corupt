import React, { useState, useEffect } from 'react';
import { ReportType, ProjectIssueType } from '../types';
import type { FormData } from '../types';
import allRegions from '../regions.json' with { type: 'json' };
import allProvinces from '../provinces.json' with { type: 'json' };
import allCities from '../cities.json' with { type: 'json' };

interface CorruptionReportFormProps {
  onSubmit: (formData: FormData, file: File | null) => void;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const CorruptionReportForm: React.FC<CorruptionReportFormProps> = ({ onSubmit }) => {
  const [reportType, setReportType] = useState<ReportType>(ReportType.PROJECT);
  const [projectName, setProjectName] = useState('');
  const [politicianName, setPoliticianName] = useState('');
  const [position, setPosition] = useState('');
  const [projectIssueType, setProjectIssueType] = useState<ProjectIssueType>(ProjectIssueType.GHOST);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);

  const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [provinces, setProvinces] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    if (selectedRegion) {
      const regionCode = allRegions.find(r => r.id === selectedRegion)?.reg_code;
      const filteredProvinces = allProvinces.filter(p => p.reg_code === regionCode);
      setProvinces(filteredProvinces);
      setSelectedProvince('');
      setSelectedCity('');
    } else {
      setProvinces([]);
    }
    }, [selectedRegion]);

    useEffect(() => {
    if (selectedProvince) {
      const provinceCode = allProvinces.find(p => p.id === selectedProvince)?.prov_code;
      const filteredCities = allCities.filter(c => c.provCode === provinceCode);
      setCities(filteredCities);
      setSelectedCity('');
    } else {
      setCities([]);
    }
    }, [selectedProvince]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        setFile(null);
        setFileName('');
        e.target.value = ''; // Reset the file input
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileError) {
      // Don't submit if there's a file error
      return;
    }
    const formData: FormData = {
      reportType,
      regionId: selectedRegion,
      provinceId: selectedProvince,
      cityId: selectedCity,
      description,
      ...(reportType === ReportType.PROJECT && { projectName, projectIssueType }),
      ...(reportType === ReportType.POLITICIAN && { politicianName, position }),
    };
    onSubmit(formData, file);
  };

  const commonInputClasses = "w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition";
  const reportTypeButtonClasses = "p-4 border rounded-lg text-center transition flex items-center justify-center min-h-[4.5rem]";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Type of Report</label>
        <div className="grid grid-cols-2 gap-4">
          <button type="button" onClick={() => setReportType(ReportType.PROJECT)} className={`${reportTypeButtonClasses} ${reportType === ReportType.PROJECT ? 'bg-red-100 dark:bg-red-900/40 border-red-500 text-red-700 dark:text-red-300' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
            Project
          </button>
          <button type="button" onClick={() => setReportType(ReportType.POLITICIAN)} className={`${reportTypeButtonClasses} ${reportType === ReportType.POLITICIAN ? 'bg-red-100 dark:bg-red-900/40 border-red-500 text-red-700 dark:text-red-300' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
            Politician: Report a buwaya
          </button>
        </div>
      </div>

      {reportType === ReportType.PROJECT ? (
        <>
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Project Name</label>
            <input type="text" id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} className={commonInputClasses} placeholder="e.g., City Central Bridge Construction" />
          </div>
          <div>
            <label htmlFor="projectIssueType" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Type of Issue</label>
            <select id="projectIssueType" value={projectIssueType} onChange={(e) => setProjectIssueType(e.target.value as ProjectIssueType)} className={commonInputClasses}>
              <option value={ProjectIssueType.GHOST}>Ghost Project (Doesn't exist)</option>
              <option value={ProjectIssueType.SUBSTANDARD}>Substandard Quality</option>
              <option value={ProjectIssueType.NON_COMPLIANT}>Not to Specifications</option>
            </select>
          </div>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="politicianName" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Politician's Name</label>
            <input type="text" id="politicianName" value={politicianName} onChange={(e) => setPoliticianName(e.target.value)} className={commonInputClasses} placeholder="e.g., John Doe" required />
          </div>
           <div>
            <label htmlFor="position" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Position / Agency</label>
            <input type="text" id="position" value={position} onChange={(e) => setPosition(e.target.value)} className={commonInputClasses} placeholder="e.g., Mayor of Metropolis" />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Location</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
            <select id="region" value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} className={commonInputClasses} required>
                <option value="" disabled>Select Region</option>
                {allRegions.map(region => (
                    <option key={region.id} value={region.id}>{region.reg_desc}</option>
                ))}
            </select>
            <select id="province" value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)} className={commonInputClasses} disabled={!selectedRegion} required>
                <option value="" disabled>Select Province</option>
                {provinces.map(province => (
                    <option key={province.id} value={province.id}>{province.prov_desc}</option>
                ))}
            </select>
            <select id="city" value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className={commonInputClasses} disabled={!selectedProvince} required>
                <option value="" disabled>Select City/Municipality</option>
                {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.citymunDesc}</option>
                ))}
            </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Detailed Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className={commonInputClasses} placeholder="Provide as much detail as possible. What did you observe? When and where?" required></textarea>
      </div>

       <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Attach Evidence (Optional)</label>
        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-700 rounded-md font-medium text-red-600 dark:text-red-400 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500 border border-slate-300 dark:border-slate-600 p-2.5 flex justify-center items-center">
          <span>{fileName ? 'Change file' : 'Upload a file'}</span>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,application/pdf" />
        </label>
        {fileName && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{fileName}</p>}
        {fileError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fileError}</p>}
      </div>

      <div>
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition">
          Submit Report
        </button>
      </div>
    </form>
  );
};