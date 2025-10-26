import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Linkedin, UploadCloud, FileCheck2 } from "lucide-react";
import { motion } from "framer-motion";

export const CvUploadForm = ({ onAnalyzeClick, isLoading }) => {
  const [file, setFile] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");

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
    if (!linkedinUrl) {
      alert("Please enter a LinkedIn URL");
      return;
    }
    
    onAnalyzeClick(file, linkedinUrl);
  };

  return (
    <motion.form
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full max-w-lg space-y-6"
    >
      {/* CV Yükleme Alanı */}
      <div className="space-y-2">
        <label className="font-medium">Upload Your CV (.pdf)</label>
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer
           transition-colors ${
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

      {/* LinkedIn URL Alanı */}
      <div className="space-y-2">
        <label htmlFor="linkedin" className="font-medium">
          Linkedin Job Posting URL
        </label>
        <div className="relative">
          <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="linkedin"
            placeholder="https://linkedin.com/in/..."
            className="pl-10"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isLoading || !file || !linkedinUrl}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze & Compare"
        )}
      </Button>
    </motion.form>
  );
};
