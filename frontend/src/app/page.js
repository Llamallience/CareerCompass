"use client";
import React from "react";
import WelcomeSection from "@/components/home/WelcomeSection";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  const handleStartClick = () => {
    router.push("/welcome");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className=" flex flex-col items-center justify-center min-h-screen bg-background text-foreground mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8"
    >
      <WelcomeSection onStartClick={handleStartClick} />
    </motion.div>
  );
}
