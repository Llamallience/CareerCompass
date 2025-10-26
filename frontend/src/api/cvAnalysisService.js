import apiClient from "./apiClient";
import mockData from "./mockData.json";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/**
 * CV Analysis API
 * @param {File} cvFile - CV file (PDF)
 * @param {string} linkedinUrl - LinkedIn profile URL (optional)
 * @param {string} targetJobTitle - Target job title (optional)
 * @returns {Promise} CV analysis results
 */
export const analyzeCv = async (
  cvFile,
  linkedinUrl = "",
  targetJobTitle = ""
) => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return mockData.cvAnalysis.responseExample;
  }

  try {
    const formData = new FormData();

    if (cvFile) {
      formData.append("cv_file", cvFile);
    }

    if (linkedinUrl) {
      formData.append("linkedin_url", linkedinUrl);
    }

    const response = await apiClient.post("/analyze_linkedin", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("CV Analysis Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Analyze LinkedIn Profile with CV
 * @param {File} cvFile - CV file (PDF)
 * @param {string} linkedinUrl - LinkedIn profile URL
 * @returns {Promise} LinkedIn analysis results
 */
export const analyzeLinkedIn = async (cvFile, linkedinUrl) => {
  try {
    if (!cvFile) {
      throw new Error("CV file is required");
    }
    if (!linkedinUrl) {
      throw new Error("LinkedIn URL is required");
    }

    const formData = new FormData();
    formData.append("cv_file", cvFile);
    formData.append("linkedin_url", linkedinUrl);

    const response = await apiClient.post("/api/cv-analysis/analyze_linkedin", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("LinkedIn Analysis Error:", error.response?.data || error.message);
    throw error;
  }
};
