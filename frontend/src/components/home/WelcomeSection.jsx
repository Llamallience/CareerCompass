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
    <Image src="/assets/images/logo.png" alt="logo" width={300} height={300} />
    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
      <TypeAnimation
        sequence={["Meet Your AI Career Coach", 1500]}
        wrapper="span"
        speed={30}
        repeat={3}
        cursor={true}
      />
    </h1>

    <p className="text-lg md:text-xl text-muted-foreground mb-8">
      Ready to take your career to the next level? Our AI Career Coach is here
      to help you identify the skills you need and create a personalized roadmap
      to your dream job.
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
