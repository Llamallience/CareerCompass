"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

export const JobSearchHeader = ({
  inputValue,
  setInputValue,
  handleSearchSubmit,
  isLoading,
}) => {
  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Find Your Dream Job with AI
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Describe your ideal position in everyday language and instantly discover
        the most relevant job opportunities.
      </p>
      
      <form onSubmit={handleSearchSubmit} className="flex w-full relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="e.g., Data Scientist with Machine Learning skills in Remote positions"
          className="pl-12 h-12 text-lg flex-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <Button type="submit" size="lg" className="ml-2 h-12 cursor-pointer" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Search className="h-5 w-5 md:hidden" />
              <span className="hidden md:block">Search</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
