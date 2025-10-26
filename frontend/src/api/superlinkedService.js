import apiClient from "./apiClient";

/**
 * Superlinked Job Search API
 * @param {string} naturalQuery - Natural language search query
 * @returns {Promise} Job search results from Superlinked
 */
export const searchJobsSuperlinked = async (naturalQuery) => {
  try {
    const response = await apiClient.post("/api/superlinked/search", {
      natural_query: naturalQuery,
    });

    return response.data;
  } catch (error) {
    console.error("Superlinked Search Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Superlinked Job Search with CV API
 * @param {File} cvFile - CV file (PDF)
 * @returns {Promise} Job search results based on CV
 */
export const searchJobsByCvSuperlinked = async (cvFile) => {
  try {
    if (!cvFile) {
      throw new Error("CV file is required");
    }

    const formData = new FormData();
    formData.append("cv_file", cvFile);

    const response = await apiClient.post("/api/superlinked/search/job", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("CV Search Error:", error.response?.data || error.message);
    throw error;
  }
};
