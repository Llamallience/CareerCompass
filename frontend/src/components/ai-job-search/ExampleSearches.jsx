"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const suggestions = [
  "Data Scientist jobs in Australia with Machine Learning skills",
  "Remote Software Engineer positions with React and TypeScript",
  "Senior Data Analyst roles in New York with SQL experience",
  "Product Manager positions in San Francisco",
  "DevOps Engineer jobs with Kubernetes and AWS",
];

export const ExampleSearches = ({ onSelectExample }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-3"
    >
      <span className="text-sm text-muted-foreground">
        Try these example searches:
      </span>
      <div className="flex flex-wrap justify-center gap-3">
        {suggestions.map((text, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-balance h-auto py-2 cursor-pointer"
            onClick={() => onSelectExample(text)}
          >
            {text}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};
