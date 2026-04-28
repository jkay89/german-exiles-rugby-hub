import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SponsorFieldsProps {
  prefix: "match" | "motm" | "ball";
  label: string;
  defaults?: {
    name?: string | null;
    logo_url?: string | null;
    url?: string | null;
  };
}

/**
 * Renders three inputs: sponsor name, logo URL, link URL.
 * Field names follow `${prefix}_sponsor_name`, `${prefix}_sponsor_logo_url`, `${prefix}_sponsor_url`.
 */
const SponsorFields = ({ prefix, label, defaults }: SponsorFieldsProps) => {
  return (
    <div className="md:col-span-2 border border-gray-700 rounded-md p-4 bg-gray-800/40">
      <h4 className="text-german-gold font-semibold mb-3">{label}</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label className="text-white mb-1 block text-xs">Sponsor name</Label>
          <Input
            name={`${prefix}_sponsor_name`}
            placeholder="e.g. Acme Ltd"
            className="bg-gray-800 border-gray-700 text-white"
            defaultValue={defaults?.name ?? ""}
          />
        </div>
        <div>
          <Label className="text-white mb-1 block text-xs">Logo URL</Label>
          <Input
            name={`${prefix}_sponsor_logo_url`}
            type="url"
            placeholder="https://..."
            className="bg-gray-800 border-gray-700 text-white"
            defaultValue={defaults?.logo_url ?? ""}
          />
        </div>
        <div>
          <Label className="text-white mb-1 block text-xs">Link URL</Label>
          <Input
            name={`${prefix}_sponsor_url`}
            type="url"
            placeholder="https://..."
            className="bg-gray-800 border-gray-700 text-white"
            defaultValue={defaults?.url ?? ""}
          />
        </div>
      </div>
    </div>
  );
};

export default SponsorFields;
