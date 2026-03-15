import axios from 'axios';
import type { GlossaryData, GlossaryUpdateResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const glossaryAPI = {
    updateCommunityGlossary: async (updatedGlossary: GlossaryData, workID: string, versionNumber: number): Promise<GlossaryUpdateResponse> => {
        const response = await axios.put(`${API_BASE_URL}/books/${workID}/glossary`, { userInputGlossaryContent: updatedGlossary, version: versionNumber });
        return {
            success: true,
            glossary: response.data.glossary,
            version: response.data.glossary.version_number,
            message: response.data.message,
        }
    }
}