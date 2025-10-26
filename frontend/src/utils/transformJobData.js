export const transformJobData = (apiResponse) => {
  if (!apiResponse?.entries || !Array.isArray(apiResponse.entries)) {
    console.error("Invalid API response structure:", apiResponse);
    return { jobs: [], overallSummary: null };
  }

  const jobs = apiResponse.entries.map((entry, index) => {
    const fields = entry.fields || {};
    const metadata = entry.metadata || {};

    // Score'u 0-100 arasına dönüştür
    const matchPercentage = metadata.score
      ? Math.round(metadata.score * 100)
      : 0;

    // Job skills - API'den gelen tüm beceriler
    const jobSkills = Array.isArray(fields.job_skills) ? fields.job_skills : [];

    return {
      id: entry.id || index,
      title: fields.job_title || "No Title",
      company: fields.company || "Unknown Company",
      location: fields.job_location || fields.search_city || "Remote",
      salary: fields.salary || "Not Specified",
      matchPercentage,
      description: fields.job_summary
        ? fields.job_summary.length > 300
          ? fields.job_summary.substring(0, 300) + "..."
          : fields.job_summary
        : "No description available",
      // Tüm becerileri matchingSkills olarak göster (score'a göre eşleşme var)
      matchingSkills: jobSkills.slice(0, 10), // İlk 10 beceri
      missingSkills: [], // Backend'den gelirse buraya eklenebilir
      jobType: fields.job_type || "Full-time",
      jobLevel: fields.job_level || "Not Specified",
      jobCategory: fields.job_category || "General",
      // Birden fazla link formatını destekle
      jobLink: fields.job_link || fields.jobUrl || fields.job_url || null,
    };
  });

  const avgMatch =
    jobs.length > 0
      ? Math.round(
          jobs.reduce((acc, job) => acc + job.matchPercentage, 0) / jobs.length
        )
      : 0;

  // En çok talep edilen becerileri hesapla
  const allSkills = jobs.flatMap((job) => job.matchingSkills);
  const skillCounts = allSkills.reduce((acc, skill) => {
    if (skill) {
      // Boş string kontrolü
      acc[skill] = (acc[skill] || 0) + 1;
    }
    return acc;
  }, {});

  const topSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([skill]) => skill);

  const overallSummary = {
    message: `${jobs.length} job posts found, average match score %${avgMatch}. These positions align with your skills and experience.`,
    topSkillsInDemand: topSkills,
  };

  console.log("✅ Transformed data:", {
    jobCount: jobs.length,
    avgMatch,
    sampleJob: jobs[0], // İlk işi logla, debug için
  });

  return { jobs, overallSummary };
};
