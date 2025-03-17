
import { motion } from "framer-motion";
import NextFixtureCard from "./NextFixtureCard";
import LatestResultCard from "./LatestResultCard";
import { Fixture } from "@/utils/fixtureUtils";

interface FeatureGridProps {
  nextFixture: Fixture | null;
}

const FeatureGrid = ({ nextFixture }: FeatureGridProps) => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <NextFixtureCard fixture={nextFixture} />
          <LatestResultCard />
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
