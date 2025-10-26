"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JobSearchHeader } from "./JobSearchHeader";
import { ExampleSearches } from "./ExampleSearches";
import { JobSearchLoadingState } from "./JobSearchLoadingState";
import { JobResultsSection } from "./JobResultsSection";
import { searchJobsSuperlinked } from "@/api";
import { useToast } from "@/components/ui/toast";

export const JobSearchDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const { showToast } = useToast();
  
  // Filter state
  const [filters, setFilters] = useState({
    locations: [],
    jobTypes: [],
    jobLevels: [],
    jobCategories: [],
  });

  const handleExampleClick = useCallback((exampleText) => {
    setSearchQuery(exampleText);
  }, []);

  const performSearch = useCallback(async (query) => {
    setIsLoading(true);
    setIsSearchSubmitted(true);

    try {
      const response = await searchJobsSuperlinked(query);
      const jobsData = response?.entries || response?.results || [];
      
      const transformedJobs = jobsData.map((entry) => {
        const fields = entry.fields || entry;
        const metadata = entry.metadata || {};
        const score = metadata.score || 0;
        
        // Job skills'i düzgün parse et
        let jobSkills = [];
        if (fields.job_skills) {
          if (Array.isArray(fields.job_skills)) {
            jobSkills = fields.job_skills;
          } else if (typeof fields.job_skills === "string") {
            jobSkills = fields.job_skills.split(",").map((s) => s.trim()).filter(Boolean);
          }
        }

        return {
          id: entry.id || Math.random().toString(),
          title: fields.job_title || "N/A",
          company: fields.company || "Unknown Company",
          location: fields.job_location || "Unknown Location",
          salary: fields.salary || "N/A",
          matchPercentage: Math.round(score * 100),
          jobType: fields.job_type || "Unknown",
          jobLevel: fields.job_level || "Unknown",
          // İlk 10 skill'i matchingSkills olarak göster
          matchingSkills: jobSkills.slice(0, 10),
          missingSkills: [], // Backend'den gelirse buraya eklenebilir
          description: fields.job_description || fields.job_summary || "No description available",
          jobCategory: fields.job_category || null,
          job_link: fields.job_link || fields.jobUrl || fields.job_url || null,
        };
      });

      setAllJobs(transformedJobs);
    } catch (error) {
      console.error("Search failed:", error);
      showToast("Failed to search jobs. Please try again.", "error");
      setAllJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
      performSearch(searchQuery);
    },
    [searchQuery, performSearch]
  );

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center min-h-screen bg-background text-foreground mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8"
      animate={{ justifyContent: isSearchSubmitted ? "flex-start" : "center" }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <motion.div
        layout
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="w-full max-w-3xl text-center"
      >
        <JobSearchHeader
          inputValue={searchQuery}
          setInputValue={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
          isLoading={isLoading}
        />
      </motion.div>

      <div className="mt-12 w-full">
        <AnimatePresence mode="wait">
          {!isSearchSubmitted ? (
            <ExampleSearches onSelectExample={handleExampleClick} />
          ) : isLoading ? (
            <JobSearchLoadingState />
          ) : (
            <JobResultsSection
              allJobs={allJobs}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
