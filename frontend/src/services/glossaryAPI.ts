import axios from 'axios';
import type { GlossaryData, GlossaryUpdateResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const glossaryAPI = {
    updateCommunityGlossary: async (updatedGlossary: GlossaryData, workID: string): Promise<GlossaryUpdateResponse> => {
        console.log(typeof(updatedGlossary))
        const response = await axios.put(`${API_BASE_URL}/books/${workID}/glossary`, { userInput: updatedGlossary });
        console.log(response)
        return {
            success: true,
            glossary: response.data.glossary,
            message: response.data.details,
        }
    }
}