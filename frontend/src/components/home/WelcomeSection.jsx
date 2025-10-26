import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";

const WelcomeSection = ({ onStartClick }) => (
  <motion.div
    key="welcome"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
    className="flex flex-col items-center text-center max-w-2xl"
  >
    <Image src="/assets/images/logo1.png" alt="logo" width={400} height={400} />
    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
      <TypeAnimation
        sequence={["Navigate Your Professional Journey", 1500]}
        wrapper="span"
        speed={30}
        repeat={3}
        cursor={true}
      />
    </h1>

    <p className="text-lg md:text-xl text-muted-foreground mb-8">
      Let CareerCompass guide you through your career path with AI-powered insights.
      Discover perfect job matches, analyze opportunities, and chart your course to success.
    </p>
    <Button
      size="lg"
      className="px-8 py-6 text-lg cursor-pointer "
      onClick={onStartClick}
    >
      Start Now
    </Button>
  </motion.div>
);

export default WelcomeSection;
