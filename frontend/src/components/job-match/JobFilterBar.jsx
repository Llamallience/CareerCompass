import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, MapPin, Briefcase, TrendingUp, FolderOpen } from "lucide-react";

export const JobFilterBar = ({ onFiltersChange, jobsData = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    locations: [],
    jobTypes: [],
    jobLevels: [],
    jobCategories: [],
  });

  useEffect(() => {
    onFiltersChange(selectedFilters);
  }, [selectedFilters, onFiltersChange]);

  const extractUniqueValues = (key) => {
    const values = jobsData
      .map(job => {
        if (key === 'locations') return job.location;
        if (key === 'jobTypes') return job.jobType;
        if (key === 'jobLevels') return job.jobLevel;
        if (key === 'jobCategories') return job.jobCategory;
        return null;
      })
      .filter(Boolean);
    return [...new Set(values)].sort();
  };

  const locations = extractUniqueValues('locations');
  const jobTypes = extractUniqueValues('jobTypes');
  const jobLevels = extractUniqueValues('jobLevels');
  const jobCategories = extractUniqueValues('jobCategories');

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => {
      const currentFilters = prev[category];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter(item => item !== value)
        : [...currentFilters, value];
      
      return { ...prev, [category]: newFilters };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      locations: [],
      jobTypes: [],
      jobLevels: [],
      jobCategories: [],
    });
  };

  const getTotalActiveFilters = () => {
    return Object.values(selectedFilters).flat().length;
  };

  const removeFilter = (category, value) => {
    toggleFilter(category, value);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {getTotalActiveFilters() > 0 && (
            <Badge variant="default" className="ml-1">{getTotalActiveFilters()}</Badge>
          )}
        </Button>

        {getTotalActiveFilters() > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </div>

      <AnimatePresence>
        {selectedFilters.locations.length > 0 || 
         selectedFilters.jobTypes.length > 0 || 
         selectedFilters.jobLevels.length > 0 || 
         selectedFilters.jobCategories.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {selectedFilters.locations.map(loc => (
              <Badge key={loc} variant="secondary" className="flex items-center gap-1.5 pl-2 pr-1.5 py-1">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{loc}</span>
                <button
                  type="button"
                  className="ml-0.5 hover:bg-destructive/20 rounded-sm p-0.5 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFilter('locations', loc);
                  }}
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                </button>
              </Badge>
            ))}
            {selectedFilters.jobTypes.map(type => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1.5 pl-2 pr-1.5 py-1">
                <Briefcase className="w-3 h-3" />
                <span className="text-xs">{type}</span>
                <button
                  type="button"
                  className="ml-0.5 hover:bg-destructive/20 rounded-sm p-0.5 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFilter('jobTypes', type);
                  }}
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                </button>
              </Badge>
            ))}
            {selectedFilters.jobLevels.map(level => (
              <Badge key={level} variant="secondary" className="flex items-center gap-1.5 pl-2 pr-1.5 py-1">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs">{level}</span>
                <button
                  type="button"
                  className="ml-0.5 hover:bg-destructive/20 rounded-sm p-0.5 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFilter('jobLevels', level);
                  }}
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                </button>
              </Badge>
            ))}
            {selectedFilters.jobCategories.map(cat => (
              <Badge key={cat} variant="secondary" className="flex items-center gap-1.5 pl-2 pr-1.5 py-1">
                <FolderOpen className="w-3 h-3" />
                <span className="text-xs">{cat}</span>
                <button
                  type="button"
                  className="ml-0.5 hover:bg-destructive/20 rounded-sm p-0.5 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFilter('jobCategories', cat);
                  }}
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                </button>
              </Badge>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-4 bg-card space-y-4"
          >
            {locations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold">Location</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {locations.map(location => (
                    <Button
                      key={location}
                      variant={selectedFilters.locations.includes(location) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter('locations', location)}
                    >
                      {location}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {jobTypes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold">Job Type</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map(type => (
                    <Button
                      key={type}
                      variant={selectedFilters.jobTypes.includes(type) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter('jobTypes', type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {jobLevels.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold">Job Level</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobLevels.map(level => (
                    <Button
                      key={level}
                      variant={selectedFilters.jobLevels.includes(level) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter('jobLevels', level)}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {jobCategories.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FolderOpen className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold">Job Category</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobCategories.map(category => (
                    <Button
                      key={category}
                      variant={selectedFilters.jobCategories.includes(category) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter('jobCategories', category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
