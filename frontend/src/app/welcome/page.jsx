"use client";
import React from "react";
import ToolSection from "@/components/home/ToolSection";
import { motion } from "framer-motion";

export default function WelcomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8"
    >
      <ToolSection />
    </motion.div>
  );
}
