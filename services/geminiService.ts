import { GoogleGenAI } from "@google/genai";
import type { FormData } from '../types';
import { ReportType, ProjectIssueType } from '../types';

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const fileToGenerativePart = async (file: File) => {
  if (!SUPPORTED_MIME_TYPES.some(type => file.type.startsWith(type.replace('/*', '')))) {
    throw new Error(`Unsupported file format. Please upload a valid image (JPEG, PNG, WEBP) or a PDF file.`);
  }

  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as data URL."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read the file."));
    reader.readAsDataURL(file);
  });

  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const formatPrompt = (formData: FormData): string => {
  let subjectDetails = '';
  if (formData.reportType === ReportType.PROJECT) {
    subjectDetails = `
- **Project Name:** ${formData.projectName || 'N/A'}
- **Type of Issue:** ${formData.projectIssueType ? ProjectIssueType[formData.projectIssueType] : 'N/A'}
    `;
  } else {
    subjectDetails = `
- **Politician Name:** ${formData.politicianName || 'N/A'}
- **Position / Agency:** ${formData.position || 'N/A'}
    `;
  }
  
  return `
# Corruption Report Submission

## Report Type
${ReportType[formData.reportType]}

## Subject Details
${subjectDetails}
- **Location:** ${formData.location}

## Reporter's Description
${formData.description}
---
Please analyze this report and provide a professional, structured summary.
  `;
};

export const generateReportSummary = async (formData: FormData, file: File | null): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash';
    
    const systemInstruction = `You are an expert anti-corruption analyst. Your task is to review a corruption report submitted by a citizen and generate a formal, structured summary. The summary should be objective, highlight key facts, identify potential red flags based on the provided information, and suggest a clear path for further investigation. Structure your response with markdown. Do not make definitive judgments of guilt, but rather focus on analyzing the evidence provided and its implications.`;

    const prompt = formatPrompt(formData);
    const parts: any[] = [{ text: prompt }];

    if (file) {
      const imagePart = await fileToGenerativePart(file);
      parts.push(imagePart);
    }
    
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
          systemInstruction,
      }
    });

    return response.text;
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    
    // Pass through user-facing errors from helpers
    if (error.message.startsWith('Unsupported file format') || error.message.startsWith('Failed to read')) {
        throw error;
    }

    // Handle API-specific errors
    if (error.message?.includes('API key not valid')) {
      throw new Error("API key is invalid.");
    }
    
    // Handle network errors (can be brittle, but a good guess)
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('NetworkError'))) {
      throw new Error("Network error. Please check your internet connection.");
    }
    
    // Generic fallback
    throw new Error("The AI service failed to process the report. Please try again later.");
  }
};