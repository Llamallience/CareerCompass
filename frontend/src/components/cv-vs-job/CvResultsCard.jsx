"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  AlertCircle,
  BookOpen,
  Target,
  Check,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import { ProgressCircle } from "@/components/ui/progress-circle";

const MatchScoreSection = ({ matchScore, targetRole }) => (
  <div className="flex flex-col items-center justify-center p-6 bg-linear-to-br from-primary/5 to-primary/10 rounded-xl border">
    <ProgressCircle percentage={matchScore} size={160} strokeWidth={12} />
    <div className="mt-5 text-center">
      <h3 className="text-lg font-medium text-muted-foreground">Target Role</h3>
      <p className="text-xl font-bold text-primary mt-1">
        {targetRole || "N/A"}
      </p>
    </div>
  </div>
);

const SkillsList = ({
  title,
  skills = [],
  variant = "default",
  icon,
  comment,
}) => (
  <div>
    <h4 className="font-semibold mb-3 flex items-center gap-2">
      {icon} {title}
    </h4>
    {skills.length > 0 ? (
      <>
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill) => (
            <Badge key={skill} variant={variant}>
              {skill}
            </Badge>
          ))}
        </div>
        {comment && (
          <p className="text-sm text-muted-foreground leading-relaxed mt-2 p-3 bg-muted/50 rounded-lg border">
            {comment}
          </p>
        )}
      </>
    ) : (
      <p className="text-sm text-muted-foreground italic">No skills listed.</p>
    )}
  </div>
);

const ResourceCard = ({ resource }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="group relative bg-card overflow-hidden hover:shadow-md transition-shadow duration-300"
  >
    <div className="flex gap-4 p-4 items-center">
      <div className="aspect-square w-20 h-20 overflow-hidden relative rounded-lg">
        <Image
          src={
            resource?.image ||
            "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*OYUijA9Q8o_U243FEdwjUA.jpeg"
          }
          alt={resource?.title || "Resource image"}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {resource?.title || "Untitled Resource"}
          </h4>
          <Badge variant="secondary" className="shrink-0 text-xs mt-0.5">
            {resource?.category || "General"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {resource?.tags?.map((tag, index) => (
            <Badge
              key={`${tag}-${index}`}
              variant="outline"
              className="text-xs"
            >
              <Target className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-xs h-8 px-2"
          asChild
        >
          <Link
            href={resource?.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-3 h-3 mr-2" /> Start Learning
          </Link>
        </Button>
      </div>
    </div>
  </motion.div>
);

const LearningResourcesSection = ({ resources = [] }) => (
  <Card className="lg:sticky lg:top-4">
    <CardHeader>
      <CardTitle className="text-2xl flex items-center gap-2">
        <Target className="w-6 h-6 text-primary" /> Suggested Learning Resources
      </CardTitle>
      <CardDescription>
        Curated materials to fill your skill gaps
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 -mr-2 scrollbar-thin">
        {resources.length > 0 ? (
          resources.map((resource, index) => (
            <ResourceCard key={`resource-${index}`} resource={resource} />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No specific resources suggested based on this analysis.</p>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const JobMatchPromptCard = () => {
  const handleViewJobs = () => {
    // Set flag before navigating to job-match page
    localStorage.setItem('shouldAutoAnalyze', 'true');
  };
  
  return (
    <Card className="bg-gray-100 border-gray-200 w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Briefcase className="w-5 h-5" /> Find Jobs Matching Your CV
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4">
          Would you like to view job listings that match your CV and skills?
        </p>
        <Button 
          asChild 
          className="w-full bg-black hover:bg-gray-800 text-white"
        >
          <Link href="/job-match" onClick={handleViewJobs}>
            <Briefcase className="w-4 h-4 mr-2" />
            View Job Listings
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export const CvResultsCard = ({ data }) => {
  // API response structure: { success: true, data: { analysis_results, suggested_learning_resources } }
  const apiData = data?.data || data;
  const analysisResults = apiData?.analysis_results || {};
  const matchScore = analysisResults.match_score?.value || 0;
  const targetRole = analysisResults.target_role || "Not Specified";
  const strongSkills = analysisResults.strong_skills || [];
  const strongSkillsComment = analysisResults.strong_skills_comment || "";
  const skillsToDevelop = analysisResults.skills_to_develop || [];
  const skillsToDevelopComment =
    analysisResults.skills_to_develop_comment || "";
  const learningResources = apiData?.suggested_learning_resources || [];

  return (
    <motion.div
      key="results-cv-main"
      className="w-full max-w-7xl mt-8 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" /> Analysis Results
              </CardTitle>
              <CardDescription>
                Your CV analysis for:{" "}
                <span className="font-semibold">{targetRole}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <MatchScoreSection
                matchScore={matchScore}
                targetRole={targetRole}
              />
              <Separator />
              <SkillsList
                title="Strong Skills (Found in Your CV)"
                skills={strongSkills}
                comment={strongSkillsComment}
                icon={<Check className="w-4 h-4 text-green-600" />}
              />
              <Separator />
              <SkillsList
                title="Skills to Develop"
                skills={skillsToDevelop}
                comment={skillsToDevelopComment}
                variant="destructive"
                icon={<AlertCircle className="w-4 h-4 text-destructive" />}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <LearningResourcesSection resources={learningResources} />
        </div>
      </div>
      <div className="mt-6">
        <JobMatchPromptCard />
      </div>
    </motion.div>
  );
};
