
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const categoryColors = {
  "速食": "bg-red-100 text-red-800 border-red-200",
  "中式": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "日式": "bg-pink-100 text-pink-800 border-pink-200",
  "韓式": "bg-purple-100 text-purple-800 border-purple-200",
  "異國": "bg-blue-100 text-blue-800 border-blue-200",
  "甜點": "bg-green-100 text-green-800 border-green-200",
  "咖啡": "bg-amber-100 text-amber-800 border-amber-200",
  "其他": "bg-gray-100 text-gray-800 border-gray-200"
};

export default function CategoryFilter({ categories, excludedCategories, onCategoryToggle }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        排除類別 (點擊排除)
      </label>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isExcluded = excludedCategories.includes(category);
          return (
            <Button
              key={category}
              variant="outline"
              size="sm"
              onClick={() => onCategoryToggle(category)}
              className={`${
                isExcluded 
                  ? "bg-gray-300 text-gray-700 line-through" 
                  : categoryColors[category] || categoryColors["其他"]
              } border transition-all duration-200`}
            >
              {category}
              {isExcluded && <X className="w-3 h-3 ml-1" />}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
