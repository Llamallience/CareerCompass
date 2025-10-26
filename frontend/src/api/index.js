/**
 * Central API Service Export
 * 
 * This file serves as the main entry point for all API services.
 * Import your API functions from here for consistency across the app.
 */

// Export API Client
export { default as apiClient } from "./apiClient";

// Export CV Analysis & LinkedIn Services
export { analyzeCv, analyzeLinkedIn } from "./cvAnalysisService";

// Export Superlinked Services
export {
  searchJobsSuperlinked,
  searchJobsByCvSuperlinked,
} from "./superlinkedService";
