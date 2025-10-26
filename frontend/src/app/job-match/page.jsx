"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CvUploadForm2 } from "@/components/job-match/CvUploadForm2";
import { JobMatchResults } from "@/components/job-match/JobMatchResults";
import { JobMatchLoadingState } from "@/components/job-match/JobMatchLoadingState";
import { searchJobsByCvSuperlinked } from "@/api";
import { transformJobData } from "@/utils/transformJobData";
import { useToast } from "@/components/ui/toast";

const JobMatchTitle = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Find Your Perfect Job Match
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Upload your CV to discover job opportunities that match your skills and
        experience
      </p>
    </div>
  );
};

const JobMatchHeader = () => {
  return (
    <motion.div
      layout
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="w-full max-w-2xl text-center mb-8"
    >
      <JobMatchTitle />
    </motion.div>
  );
};

const JobMatch = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleAnalyze = async (file) => {
    setIsSubmitted(true);
    setIsLoading(true);
    setAnalysisData(null);
    setError(null);

    try {
      const result = await searchJobsByCvSuperlinked(file);

      if (result.success === false) {
        const errorMessage = result.error_message || "Failed to analyze CV";
        const isCvValid = result.is_cv !== false;
        
        toast({
          title: isCvValid ? "Analysis Failed" : "Invalid CV",
          description: errorMessage,
          variant: "error"
        });
        
        setError(errorMessage);
        setIsSubmitted(false);
        return;
      }
      
      const transformedData = transformJobData(result);
      setAnalysisData(transformedData);
    } catch (err) {
      console.error("Error searching jobs:", err);
      const errorMessage = err.response?.data?.error_message || 
                          err.response?.data?.detail || 
                          err.message || 
                          "An error occurred while searching for jobs. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "error"
      });
      
      setError(errorMessage);
      setIsSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setAnalysisData(null);
    setIsSubmitted(false);
    setError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="flex flex-col items-center min-h-screen bg-background text-foreground mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8"
    >
      <motion.div
        animate={{
          justifyContent: isSubmitted && analysisData ? "flex-start" : "center",
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="w-full flex flex-col items-center min-h-[calc(100vh-200px)]"
      >
        {!isSubmitted && <JobMatchHeader />}

        <div className="w-full">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div key="upload-form" className="flex justify-center">
                <CvUploadForm2
                  onAnalyzeClick={handleAnalyze}
                  isLoading={isLoading}
                />
              </motion.div>
            ) : isLoading ? (
              <JobMatchLoadingState key="loading" />
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-lg mx-auto p-4 bg-destructive/10 border border-destructive rounded-lg text-center mt-6"
              >
                <p className="text-destructive font-semibold">{error}</p>
              </motion.div>
            ) : analysisData ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-center"
              >
                <JobMatchResults data={analysisData} onBack={handleBack} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JobMatch;
