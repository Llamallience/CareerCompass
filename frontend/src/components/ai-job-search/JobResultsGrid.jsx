"use client";
import React from "react";
import { JobMatchCard } from "@/components/job-match/JobMatchCard";

export const JobResultsGrid = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-muted-foreground">No jobs found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
      {jobs.map((job, index) => (
        <JobMatchCard key={job.id || index} job={job} index={index} />
      ))}
    </div>
  );
};
