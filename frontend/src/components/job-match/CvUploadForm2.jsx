import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, FileCheck2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export const CvUploadForm2 = ({ onAnalyzeClick, isLoading }) => {
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a CV file (.pdf)");
      return;
    }
    onAnalyzeClick(file);
  };

  return (
    <motion.form
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full max-w-2xl space-y-6"
    >
      <div className="space-y-2">
        <label className="font-medium">Upload Your CV (.pdf)</label>
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex flex-col items-center text-center">
              <FileCheck2 className="h-12 w-12 text-green-500" />
              <p className="font-semibold mt-2">File Uploaded!</p>
              <p className="text-sm text-muted-foreground">{file.name}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <UploadCloud className="h-12 w-12 text-muted-foreground" />
              <p className="font-semibold mt-2">Drag your CV here</p>
              <p className="text-sm text-muted-foreground">
                or click to select
              </p>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={isLoading || !file}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing Profile...
          </>
        ) : (
          <>
            <Briefcase className="mr-2 h-4 w-4" />
            Analyze & Find Jobs
          </>
        )}
      </Button>
    </motion.form>
  );
};
