"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";

export const ActiveFiltersBar = ({
  locations,
  jobTypes,
  jobLevels,
  jobCategories,
  onRemoveLocation,
  onRemoveJobType,
  onRemoveJobLevel,
  onRemoveJobCategory,
  onClearAll,
  totalResults,
}) => {
  const hasFilters =
    locations.length > 0 ||
    jobTypes.length > 0 ||
    jobLevels.length > 0 ||
    jobCategories.length > 0;

  if (!hasFilters) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-6 p-4 bg-muted/30 rounded-lg border"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {totalResults} {totalResults === 1 ? "job" : "jobs"} found
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-8 text-xs"
        >
          Clear All
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {locations.map((loc) => (
          <Badge key={loc} variant="secondary" className="flex items-center gap-1.5 pl-2 pr-1.5 py-1">
            <span className="text-xs">📍 {loc}</span>
            <button
              type="button"
              className="ml-0.5 hover:bg-destructive/20 rounded-sm p-0.5 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemoveLocation(loc);
              }}
            >
              <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
            </button>
          </Badge>
        ))}

        {jobTypes.map((type) => (
          <Badge key={type} variant="secondary" className="flex items-center gap-1.5 pl-2 pr-1.5 py-1">
            <span className="text-xs">{type}</span>
            <button
              type="button"
              className="ml-0.5 hover:bg-destructive/20 rounded-sm p-0.5 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemoveJobType(type);
              }}
            >
              <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
            </button>
          </Badge>
        ))}

        {jobLevels.map((level) => (
          <Badge key={level} variant="secondary" className="flex items-center gap-1.5 pl-2 pr-1.5 py-1">
            <span className="text-xs">{level}</span>
            <button
              type="button"
              className="ml-0.5 hover:bg-destructive/20 rounded-sm p-0.5 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemoveJobLevel(level);
              }}
            >
              <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
            </button>
          </Badge>
        ))}

        {jobCategories.map((cat) => (
          <Badge key={cat} variant="secondary" className="flex items-center gap-1.5 pl-2 pr-1.5 py-1">
            <span className="text-xs">{cat}</span>
            <button
              type="button"
              className="ml-0.5 hover:bg-destructive/20 rounded-sm p-0.5 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemoveJobCategory(cat);
              }}
            >
              <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
            </button>
          </Badge>
        ))}
      </div>
    </motion.div>
  );
};
