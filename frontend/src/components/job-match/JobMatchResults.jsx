import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { JobMatchCard } from "./JobMatchCard";
import { JobFilterBar } from "./JobFilterBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { ArrowLeft, Briefcase } from "lucide-react";

export const JobMatchResults = ({ data, onBack }) => {
  const [filters, setFilters] = useState({
    locations: [],
    jobTypes: [],
    jobLevels: [],
    jobCategories: [],
  });

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const filteredJobs = data.jobs.filter((job) => {
    if (filters.locations.length > 0 && !filters.locations.includes(job.location)) {
      return false;
    }
    if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(job.jobType)) {
      return false;
    }
    if (filters.jobLevels.length > 0 && !filters.jobLevels.includes(job.jobLevel)) {
      return false;
    }
    if (filters.jobCategories.length > 0 && !filters.jobCategories.includes(job.jobCategory)) {
      return false;
    }
    return true;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => b.matchPercentage - a.matchPercentage);

  const averageMatch = filteredJobs.length > 0
    ? filteredJobs.reduce((acc, job) => acc + job.matchPercentage, 0) / filteredJobs.length
    : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-7xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Upload New CV
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Job Matches</h1>
            <p className="text-muted-foreground">
              Found {data.jobs.length} jobs matching your profile
              {filteredJobs.length !== data.jobs.length && ` (${filteredJobs.length} after filters)`}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <Briefcase className="w-6 h-6 mx-auto mb-1 text-primary" />
              <div className="text-2xl font-bold">{filteredJobs.length}</div>
              <div className="text-xs text-muted-foreground">Filtered Jobs</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-linear-to-br from-green-500/10 to-green-600/20 rounded-lg">
              <ProgressCircle percentage={Math.round(averageMatch)} size={100} strokeWidth={10} />
            </div>
          </div>
        </div>

        <JobFilterBar onFiltersChange={handleFiltersChange} jobsData={data.jobs} />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {sortedJobs.length > 0 ? (
          sortedJobs.map((job, index) => <JobMatchCard key={job.id || index} job={job} index={index} />)
        ) : (
          <div className="col-span-2 text-center py-12">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-xl text-muted-foreground">No jobs found with the selected filters</p>
            <Button variant="outline" className="mt-4" onClick={() => handleFiltersChange({ locations: [], jobTypes: [], jobLevels: [], jobCategories: [] })}>Clear Filters</Button>
          </div>
        )}
      </div>

      {data.overallSummary && (
        <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border">
          <h3 className="text-xl font-semibold mb-3">Overall Analysis</h3>
          <p className="text-muted-foreground mb-4">{data.overallSummary.message}</p>
          {data.overallSummary.topSkillsInDemand && (
            <div>
              <h4 className="font-medium mb-2">Top Skills in Demand:</h4>
              <div className="flex flex-wrap gap-2">
                {data.overallSummary.topSkillsInDemand.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
