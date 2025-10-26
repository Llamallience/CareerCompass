import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  PenSquare,
  Compass,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { TypeAnimation } from "react-type-animation";

const toolCards = [
  {
    id: 1,
    title: "CV vs Job Posting Analysis",
    description:
      "Upload your CV (.pdf) and paste the LinkedIn job posting URL. AI will compare your resume against the requirements and highlight keyword matches and gaps.", // Slightly refined description
    icon: PenSquare,
    link: "/cv-vs-job",
    highlighted: false,
  },
  {
    id: 2,
    title: "Find Jobs Matching Your CV", 
    description:
      "Upload your current CV (.pdf). Let AI analyze your skills and experience to find and list job postings that best match your profile.", // NEW Description
    icon: Briefcase,
    link: "/job-match",
    highlighted: false,
  },
  {
    id: 3,
    title: "Explore Careers with AI Chat", 
    description:
      "Unsure about your next step? Chat with our AI coach to explore different career paths, discuss required skills, and get personalized advice.", // NEW Description
    icon: MessageSquare, 
    link: "/ai-job-search", 
    highlighted: false,
  },
];

// Make sure to adjust the import paths for the icons and the links ('href') in your actual components as needed.

const ToolSectionTitle = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 h-[1.2em]">
        <TypeAnimation
          sequence={["Welcome to CareerCompass", 1500]}
          wrapper="span"
          speed={30}
          repeat={3}
          cursor={true}
        />
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Choose your path to career success. Analyze your CV, discover matching opportunities,
        and explore career possibilities with AI-powered guidance.
      </p>
    </div>
  );
};

const ToolCard = ({ title, description, icon: Icon, link, highlighted }) => {
  return (
    <Card
      className={`flex flex-col justify-between transition-all duration-300 ease-in-out hover:border-primary hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
        highlighted ? "border-2 border-primary" : "border border-border"
      }`}
    >
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Icon className="h-12 w-12 text-primary transition-transform duration-300 ease-in-out" />
        </div>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground grow">
        <p>{description}</p>
      </CardContent>
      <div className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={link}>Start</Link>
        </Button>
      </div>
    </Card>
  );
};

const ToolCardsArea = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {toolCards.map((card) => (
        <ToolCard
          key={card.id}
          title={card.title}
          description={card.description}
          icon={card.icon}
          link={card.link}
          highlighted={card.highlighted}
        />
      ))}
    </div>
  );
};

const ToolSection = () => (
  <motion.div
    key="tool-selector"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeInOut" }}
    className="w-full max-w-5xl"
  >
    <ToolSectionTitle />
    <ToolCardsArea />
  </motion.div>
);

export default ToolSection;
