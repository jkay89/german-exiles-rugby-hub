
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface PlayerFormProps {
  isEditing: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({
  isEditing,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-400">Name</Label>
          <Input
            name="name"
            required
            placeholder="Player name"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label className="text-gray-400">Number</Label>
          <Input
            name="number"
            type="number"
            min="1"
            max="99"
            placeholder="Jersey number"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label className="text-gray-400">Position</Label>
          <Select name="position">
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              <SelectItem value="prop">Prop</SelectItem>
              <SelectItem value="hooker">Hooker</SelectItem>
              <SelectItem value="secondRow">Second Row</SelectItem>
              <SelectItem value="looseFowrard">Loose Forward</SelectItem>
              <SelectItem value="halfBack">Half Back</SelectItem>
              <SelectItem value="standOff">Stand Off</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="wing">Wing</SelectItem>
              <SelectItem value="fullBack">Full Back</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-400">Team</Label>
          <Select name="team" required>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              <SelectItem value="heritage">Heritage Team</SelectItem>
              <SelectItem value="community">Community Team</SelectItem>
              <SelectItem value="exiles9s">Exiles 9s</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-400">Heritage</Label>
          <Input
            name="heritage"
            placeholder="Player heritage"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label className="text-gray-400">Club</Label>
          <Input
            name="club"
            placeholder="Current club"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-gray-400">Bio</Label>
          <Textarea
            name="bio"
            placeholder="Player biography"
            className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-gray-400">Photo</Label>
          <div className="flex items-center gap-4 mt-2">
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" /> Upload Photo
            </Button>
            <p className="text-sm text-gray-400">No file selected</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-german-red hover:bg-german-gold">
          {isEditing ? "Update Player" : "Add Player"}
        </Button>
      </div>
    </form>
  );
};

export default PlayerForm;
