import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { JobMatchCard } from "@/components/job-match/JobMatchCard";
import { JobFilterBar } from "@/components/job-match/JobFilterBar";
import { Button } from "@/components/ui/button";
import { Briefcase, Search } from "lucide-react";

export const JobResultsSection = ({ allJobs, filters, onFiltersChange }) => {

  const filteredJobs = useMemo(() => {
    let jobs = [...allJobs];

    if (filters.locations.length > 0) {
      jobs = jobs.filter((job) =>
        filters.locations.some((loc) => job.location.includes(loc))
      );
    }

    if (filters.jobTypes.length > 0) {
      jobs = jobs.filter((job) => filters.jobTypes.includes(job.jobType));
    }

    if (filters.jobLevels.length > 0) {
      jobs = jobs.filter((job) => filters.jobLevels.includes(job.jobLevel));
    }

    if (filters.jobCategories.length > 0) {
      jobs = jobs.filter((job) => filters.jobCategories.includes(job.jobCategory));
    }

    return jobs;
  }, [allJobs, filters]);

  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [filteredJobs]);

  const averageMatch = filteredJobs.length > 0
    ? filteredJobs.reduce((acc, job) => acc + job.matchPercentage, 0) / filteredJobs.length
    : 0;

  const clearFilters = () => {
    onFiltersChange({
      locations: [],
      jobTypes: [],
      jobLevels: [],
      jobCategories: [],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-7xl"
    >
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Search Results</h1>
            <p className="text-muted-foreground">
              Found {allJobs.length} jobs matching your search
              {filteredJobs.length !== allJobs.length && ` (${filteredJobs.length} after filters)`}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <Briefcase className="w-6 h-6 mx-auto mb-1 text-primary" />
              <div className="text-2xl font-bold">{filteredJobs.length}</div>
              <div className="text-xs text-muted-foreground">Jobs Found</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <Search className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <div className="text-2xl font-bold">{Math.round(averageMatch)}%</div>
              <div className="text-xs text-muted-foreground">Avg Match</div>
            </div>
          </div>
        </div>

        <JobFilterBar onFiltersChange={onFiltersChange} jobsData={allJobs} />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {sortedJobs.length > 0 ? (
          sortedJobs.map((job, index) => (
            <JobMatchCard key={job.id || index} job={job} index={index} />
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-xl text-muted-foreground">
              No jobs found with the selected filters
            </p>
            <Button variant="outline" className="mt-4 cursor-pointer" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
