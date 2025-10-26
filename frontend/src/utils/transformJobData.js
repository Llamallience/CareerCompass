export const transformJobData = (apiResponse) => {
  if (!apiResponse?.entries || !Array.isArray(apiResponse.entries)) {
    console.error("Invalid API response structure");
    return { jobs: [], overallSummary: null };
  }

  const jobs = apiResponse.entries.map((entry, index) => {
    const fields = entry.fields || {};
    const metadata = entry.metadata || {};
    
    const matchPercentage = metadata.score 
      ? Math.round(metadata.score * 100) 
      : 0;

    return {
      id: entry.id || index,
      title: fields.job_title || "No Title",
      company: fields.company || "Unknown Company",
      location: fields.job_location || fields.search_city || "Remote",
      salary: fields.salary || "Not Specified",
      matchPercentage,
      description: fields.job_summary 
        ? fields.job_summary.substring(0, 300) + "..." 
        : "No description available",
      matchingSkills: fields.job_skills?.slice(0, 6) || [],
      missingSkills: fields.job_skills?.slice(6, 9) || [],
      jobType: fields.job_type || "Full-time",
      jobLevel: fields.job_level || "Not Specified",
      jobCategory: fields.job_category || "General",
      jobLink: fields.job_link || "#",
    };
  });

  const avgMatch = jobs.length > 0
    ? Math.round(jobs.reduce((acc, job) => acc + job.matchPercentage, 0) / jobs.length)
    : 0;

  const allSkills = jobs.flatMap(job => job.matchingSkills);
  const skillCounts = allSkills.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});
  
  const topSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([skill]) => skill);

  const overallSummary = {
    message: `Found ${jobs.length} job matches with an average match score of ${avgMatch}%. These positions align well with your skills and experience.`,
    topSkillsInDemand: topSkills,
  };

  console.log("✅ Transformed data:", { jobCount: jobs.length, avgMatch });

  return { jobs, overallSummary };
};
