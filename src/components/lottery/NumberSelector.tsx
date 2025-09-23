import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shuffle, X } from "lucide-react";

interface NumberSelectorProps {
  selectedNumbers: number[];
  onNumbersChange: (numbers: number[]) => void;
  maxNumbers?: number;
  maxValue?: number;
}

const NumberSelector = ({ 
  selectedNumbers, 
  onNumbersChange, 
  maxNumbers = 4, 
  maxValue = 32 
}: NumberSelectorProps) => {
  const [selectedCount, setSelectedCount] = useState(selectedNumbers.length);

  const handleNumberClick = (number: number) => {
    if (selectedNumbers.includes(number)) {
      // Remove number
      const newNumbers = selectedNumbers.filter(n => n !== number);
      onNumbersChange(newNumbers);
      setSelectedCount(newNumbers.length);
    } else if (selectedNumbers.length < maxNumbers) {
      // Add number
      const newNumbers = [...selectedNumbers, number].sort((a, b) => a - b);
      onNumbersChange(newNumbers);
      setSelectedCount(newNumbers.length);
    }
  };

  const generateQuickPick = () => {
    const numbers: number[] = [];
    while (numbers.length < maxNumbers) {
      const randomNum = Math.floor(Math.random() * maxValue) + 1;
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum);
      }
    }
    const sortedNumbers = numbers.sort((a, b) => a - b);
    onNumbersChange(sortedNumbers);
    setSelectedCount(sortedNumbers.length);
  };

  const clearSelection = () => {
    onNumbersChange([]);
    setSelectedCount(0);
  };

  const renderNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= maxValue; i++) {
      const isSelected = selectedNumbers.includes(i);
      const isDisabled = !isSelected && selectedNumbers.length >= maxNumbers;
      
      numbers.push(
        <Button
          key={i}
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className={`w-10 h-10 text-sm font-bold ${
            isSelected 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : isDisabled 
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-700"
          }`}
          onClick={() => handleNumberClick(i)}
          disabled={isDisabled}
        >
          {i}
        </Button>
      );
    }
    return numbers;
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Select Your Numbers</CardTitle>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            {selectedCount}/{maxNumbers} selected
          </Badge>
        </div>
        <p className="text-gray-400 text-sm">
          Pick {maxNumbers} numbers from 1 to {maxValue}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Numbers Display */}
        {selectedNumbers.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
            <span className="text-white font-medium">Your Numbers:</span>
            {selectedNumbers.map((number) => (
              <Badge key={number} className="bg-blue-600 text-white">
                {number}
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="ml-auto text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
              Clear
            </Button>
          </div>
        )}

        {/* Quick Pick Button */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={generateQuickPick}
            className="flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            Quick Pick
          </Button>
        </div>

        {/* Number Grid */}
        <div className="grid grid-cols-8 gap-2">
          {renderNumbers()}
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 text-center">
          Click numbers to select/deselect • Use Quick Pick for random selection
        </div>
      </CardContent>
    </Card>
  );
};

export default NumberSelector;