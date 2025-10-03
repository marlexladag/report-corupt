import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import type { FormData, ReportWithId } from '../types';

/**
 * Saves a new corruption report to the Firestore database.
 * The report is saved anonymously without linking to the user's UID.
 * @param formData - The report data from the form.
 * @returns A promise that resolves when the report is successfully saved.
 */
export const saveReport = async (formData: FormData): Promise<void> => {
    try {
        const reportsCollectionRef = collection(db, "reports");
        await addDoc(reportsCollectionRef, {
            ...formData,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding document: ", error);
        throw new Error("Could not save the report. Please try again.");
    }
};

/**
 * Fetches all corruption reports from the Firestore database.
 * This function should only be accessible to admins.
 * @returns A promise that resolves with an array of reports.
 */
export const getReports = async (): Promise<ReportWithId[]> => {
    try {
        const reportsCollectionRef = collection(db, "reports");
        const q = query(reportsCollectionRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const reports = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as ReportWithId));
        return reports;
    } catch (error) {
        console.error("Error getting documents: ", error);
        throw new Error("Could not fetch reports. You may not have the required permissions.");
    }
};

/**
 * Fetches all corruption reports for a specific user.
 * @param userId The UID of the user whose reports are to be fetched.
 * @returns A promise that resolves with an array of the user's reports.
 */
export const getReportsForUser = async (userId: string): Promise<ReportWithId[]> => {
    try {
        const reportsCollectionRef = collection(db, "reports");
        const q = query(reportsCollectionRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const reports = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as ReportWithId));
        return reports;
    } catch (error) {
        console.error("Error getting user documents: ", error);
        throw new Error("Could not fetch your reports. Please try again later.");
    }
};

/**
 * Fetches all publicly visible corruption reports from the Firestore database.
 * @returns A promise that resolves with an array of public reports.
 */
export const getPublicReports = async (): Promise<ReportWithId[]> => {
    try {
        const reportsCollectionRef = collection(db, "reports");
        const q = query(reportsCollectionRef, where("isPublic", "==", true), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const reports = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as ReportWithId));
        return reports;
    } catch (error) {
        console.error("Error getting public documents: ", error);
        throw new Error("Could not fetch public reports.");
    }
};

/**
 * Updates a report document in Firestore.
 * This function should only be accessible to admins.
 * @param reportId The ID of the report to update.
 * @param data The data to update.
 * @returns A promise that resolves when the report is successfully updated.
 */
export const updateReport = async (reportId: string, data: Partial<FormData>): Promise<void> => {
    try {
        const reportDocRef = doc(db, "reports", reportId);
        await updateDoc(reportDocRef, data);
    } catch (error) {
        console.error("Error updating document: ", error);
        throw new Error("Could not update the report.");
    }
};