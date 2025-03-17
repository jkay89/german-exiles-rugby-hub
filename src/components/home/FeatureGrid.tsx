
import { motion } from "framer-motion";
import NextFixtureCard from "./NextFixtureCard";
import LatestResultCard from "./LatestResultCard";
import JoinCard from "./JoinCard";
import { Fixture } from "@/utils/fixtureUtils";

interface FeatureGridProps {
  nextFixture: Fixture | null;
}

const FeatureGrid = ({ nextFixture }: FeatureGridProps) => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <NextFixtureCard fixture={nextFixture} />
          <LatestResultCard />
          <JoinCard />
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
