import React from "react";
import { Fixture } from "@/hooks/useFixtures";
import FixtureCard from "./FixtureCard";
import { useTranslation } from "react-i18next";

interface FixtureGridViewProps {
  fixtures: Fixture[];
}

const FixtureGridView = ({ fixtures }: FixtureGridViewProps) => {
  const { i18n } = useTranslation();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {fixtures.map((fixture) => (
        <FixtureCard
          key={fixture.id}
          fixture={fixture}
          locale={i18n.language}
        />
      ))}
    </div>
  );
};

export default FixtureGridView;
