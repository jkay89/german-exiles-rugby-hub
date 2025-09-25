
import React from "react";
import { motion } from "framer-motion";
import { Fixture } from "@/hooks/useFixtures";
import FixtureCard from "./FixtureCard";
import { useTranslation } from "react-i18next";

interface FixtureGridViewProps {
  fixtures: Fixture[];
  onResultAdded?: () => void;
  showAddResult?: boolean;
}

const FixtureGridView = ({ fixtures, onResultAdded, showAddResult = false }: FixtureGridViewProps) => {
  const { i18n } = useTranslation();
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {fixtures.map((fixture) => (
        <FixtureCard 
          key={fixture.id}
          id={fixture.id}
          date={fixture.date} 
          time={fixture.time || "TBC"}
          opponent={fixture.opponent} 
          location={fixture.location}
          is_home={fixture.is_home}
          competition={fixture.competition}
          locale={i18n.language}
          team={fixture.team}
          onResultAdded={onResultAdded}
          showAddResult={showAddResult}
        />
      ))}
    </div>
  );
};

export default FixtureGridView;
