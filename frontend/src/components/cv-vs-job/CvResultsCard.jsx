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
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { ProgressCircle } from "@/components/ui/progress-circle";

const COURSE_IMAGES = [
  "/assets/images/courseImgs/codecademy.png",
  "/assets/images/courseImgs/datacamp.webp",
  "/assets/images/courseImgs/coursera.png",
  "/assets/images/courseImgs/codecademy.png",
  "/assets/images/courseImgs/coursera.png",
];

const isDataCampCourse = (imageUrl) => {
  return imageUrl?.toLowerCase().includes("datacamp");
};

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

const ResourceCard = ({ resource, index }) => {
  const displayImage =
    resource?.image || COURSE_IMAGES[index % COURSE_IMAGES.length];

  const isSponsored = isDataCampCourse(displayImage);
  const displayBadge =
    resource?.badge ||
    (isSponsored
      ? { text: "Sponsored", variant: "secondary", icon: Star }
      : null);
  const BadgeIcon = displayBadge?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative bg-card overflow-hidden transition-all duration-300 rounded-lg border ${
        isSponsored
          ? "border-transparent hover:border-[#03EF62]"
          : "border-transparent hover:border-gray-200"
      } hover:shadow-lg`}
    >
      {isSponsored && (
        <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden z-10 pointer-events-none">
          <div className="absolute w-[150%] h-5 bg-linear-to-r from-[#03EF62] to-[#05D858] transform -rotate-45 left-[-25%] top-[25%] flex items-center justify-center text-white font-semibold text-[9px] tracking-wide uppercase shadow-md">
            Sponsored
          </div>
        </div>
      )}

      <div className="flex gap-4 p-4 items-center">
        <div className="aspect-square w-20 h-20 overflow-hidden relative rounded-lg shrink-0">
          <Image
            src={displayImage}
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

          {/* Special Badge (Sponsored for DataCamp) */}
          {displayBadge && (
            <div className="mb-2">
              <Badge
                variant={displayBadge.variant || "default"}
                className="text-xs font-medium"
              >
                {BadgeIcon && <BadgeIcon className="w-3 h-3 mr-1" />}
                {displayBadge.text}
              </Badge>
            </div>
          )}

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {resource?.tags?.map((tag, tagIndex) => (
              <Badge
                key={`${tag}-${tagIndex}`}
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
};

const LearningResourcesSection = ({ resources = [] }) => {
  return (
    <Card className="lg:sticky lg:top-4">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" /> Suggested Learning
          Resources
        </CardTitle>
        <CardDescription>
          Curated materials to fill your skill gaps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 -mr-2 scrollbar-thin">
          {resources.length > 0 ? (
            resources.map((resource, index) => (
              <ResourceCard
                key={`resource-${index}`}
                resource={resource}
                index={index}
              />
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
};

const JobMatchPromptCard = () => {
  const handleViewJobs = () => {
    // Set flag before navigating to job-match page
    localStorage.setItem("shouldAutoAnalyze", "true");
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
