"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CvUploadForm } from "./CvUploadForm";
import { CvLoadingState } from "./CvLoadingState";
import { CvResultsCard } from "./CvResultsCard";
import { analyzeLinkedIn } from "@/api";
import { useToast } from "@/components/ui/toast";

const CvTitle = () => {
  return (
    <div className="text-center">
      <h1 className="text-2xl md:text-5xl font-bold mb-4">
        Analyze My CV and LinkedIn Job Posting
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Upload your CV (.pdf) and provide the LinkedIn job posting URL. The AI
        will compare your resume against the job requirements and identify
        keyword gaps.
      </p>
    </div>
  );
};

const CvAnalysisHeader = () => {
  return (
    <motion.div
      layout
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="w-full max-w-lg text-center mb-8"
    >
      <CvTitle />
    </motion.div>
  );
};

const CvAnalysisArea = ({
  isSubmitted,
  isLoading,
  data,
  onAnalyzeClick,
  error,
}) => {
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div key="upload-form" className="flex justify-center">
            <CvUploadForm
              onAnalyzeClick={onAnalyzeClick}
              isLoading={isLoading}
            />
          </motion.div>
        ) : isLoading ? (
          <CvLoadingState key="loader-cv-main" />
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
        ) : data ? (
          <CvResultsCard data={data} key="results-cv-main" />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const CvAnalysis = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleAnalyzeClick = async (cvFile, linkedinUrl) => {
    setIsSubmitted(true);
    setIsLoading(true);
    setData(null);
    setError(null);

    try {
      const result = await analyzeLinkedIn(cvFile, linkedinUrl);

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
      
      setData(result);
    } catch (err) {
      console.error("Error analyzing CV:", err);
      const errorMessage = err.response?.data?.error_message || 
                          err.response?.data?.detail || 
                          err.message || 
                          "An error occurred while analyzing your CV. Please try again.";
      
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="flex flex-col items-center min-h-screen bg-background text-foreground mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8"
    >
      <motion.div
        animate={{
          justifyContent: isSubmitted && data ? "flex-start" : "center",
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="w-full flex flex-col items-center min-h-[calc(100vh-200px)]"
      >
        {!isSubmitted && <CvAnalysisHeader />}
        <CvAnalysisArea
          isSubmitted={isSubmitted}
          isLoading={isLoading}
          data={data}
          error={error}
          onAnalyzeClick={handleAnalyzeClick}
        />
      </motion.div>
    </motion.div>
  );
};

export default CvAnalysis;
