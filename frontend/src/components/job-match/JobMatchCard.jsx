import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { Building2, MapPin, Wallet, CheckCircle2, ExternalLink } from "lucide-react";

export const JobMatchCard = ({ job, index }) => {
  const jobLink = job.job_link || job.jobLink || job.jobUrl;
  
  const handleViewDetails = () => {
    if (jobLink && jobLink !== '#') {
      window.open(jobLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
              <CardDescription className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{job.company}</span>
                </div>
                {job.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                )}
              </CardDescription>
            </div>

            <ProgressCircle percentage={job.matchPercentage} size={90} strokeWidth={9} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col">
          <div className="space-y-3">
            {job.matchingSkills && job.matchingSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <h4 className="text-sm font-semibold">
                    Aranan Beceriler ({job.matchingSkills.length})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.matchingSkills.map((skill, idx) => (
                    <Badge key={`${skill}-${idx}`} variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {job.description && (
            <div className="pt-3 border-t">
              <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
            </div>
          )}

          {jobLink && jobLink !== '#' && (
            <div className="flex pt-2 mt-auto">
              <Button 
                className="flex-1 cursor-pointer" 
                variant="default"
                onClick={handleViewDetails}
              >
                İş İlanını Görüntüle
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
