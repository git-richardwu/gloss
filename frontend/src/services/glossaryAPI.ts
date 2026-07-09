import axios from 'axios';
import type { GlossaryUpdateResponse, Chapter, Character } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const glossaryAPI = {
    updateCommunityGlossary: async (updatedGlossary: Chapter[], workID: string, versionNumber: number): Promise<GlossaryUpdateResponse> => {
        const response = await axios.put(`${API_BASE_URL}/api/books/${workID}/glossary`, { userInputGlossaryContent: updatedGlossary, version: versionNumber });
        console.log(response)
        return {
            success: true,
            glossary_chapters: response.data.chapters,
            version: response.data.details.version_number,
            message: response.data.message,
        }
    },
    resolveConflicts: async (workID: string, ourGlossary: Chapter[], resolutions: Chapter[]) => {
        console.log("BEGIN RESOLUTION")
        console.log(resolutions)
        const response = await axios.post(`${API_BASE_URL}/api/books/${workID}/glossary/resolve-conflicts`,
            {
                ourGlossary: ourGlossary,
                resolutions: resolutions
            });
        return response.data;
    },
    getVersion: async (workID: string, versionNum: number) => {
        const response = await axios.get(`${API_BASE_URL}/api/books/${workID}/glossary/version/${versionNum}`)
        return {
            success: true,
            snapshot_data: response.data.snapshot_data
        }
    }
}