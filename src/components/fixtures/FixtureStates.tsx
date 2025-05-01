
import React from "react";
import { Loader2 } from "lucide-react";
import { FixtureTabType } from "@/hooks/useFixtures";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => (
  <div className="flex justify-center items-center py-12 bg-gray-900 rounded-lg border border-gray-800">
    <Loader2 className="w-8 h-8 text-german-gold animate-spin mr-2" />
    <p className="text-center text-gray-400">{message}</p>
  </div>
);

interface ErrorStateProps {
  message: string;
}

export const ErrorState = ({ message }: ErrorStateProps) => (
  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
    <p className="text-center text-red-500">Error: {message}</p>
  </div>
);

interface EmptyStateProps {
  activeTab: FixtureTabType;
}

export const EmptyState = ({ activeTab }: EmptyStateProps) => (
  <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
    <p className="text-gray-400">
      {activeTab === "upcoming" 
        ? "No upcoming fixtures available." 
        : "No past fixtures available."}
    </p>
  </div>
);
