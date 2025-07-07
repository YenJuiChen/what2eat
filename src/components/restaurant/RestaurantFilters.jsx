
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

export default function RestaurantFilters({ restaurants, filters, onFiltersChange }) {
  const cuisineTypes = [...new Set(restaurants.map(r => r.cuisine_type))].sort();
  
  const handleCuisineToggle = (cuisine) => {
    const newExcluded = filters.excludedCuisines.includes(cuisine)
      ? filters.excludedCuisines.filter(c => c !== cuisine)
      : [...filters.excludedCuisines, cuisine];
    
    onFiltersChange({
      ...filters,
      excludedCuisines: newExcluded
    });
  };

  const handleRatingChange = (value) => {
    onFiltersChange({
      ...filters,
      minRating: value[0]
    });
  };

  const handlePriceChange = (value) => {
    onFiltersChange({
      ...filters,
      maxPriceLevel: value[0]
    });
  };

  const handleDistanceChange = (value) => {
    onFiltersChange({
      ...filters,
      maxDistance: value[0]
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      excludedCuisines: [],
      minRating: 0,
      maxPriceLevel: 4,
      maxDistance: 3 // Default distance added
    });
  };

  const activeFiltersCount = 
    filters.excludedCuisines.length + 
    (filters.minRating > 0 ? 1 : 0) + 
    (filters.maxPriceLevel < 4 ? 1 : 0) +
    (filters.maxDistance < 10 && filters.maxDistance !== 3 ? 1 : 0); // Distance filter count logic

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cuisine Types */}
        <div>
          <h3 className="font-semibold mb-3">Exclude Cuisines</h3>
          <div className="flex flex-wrap gap-2">
            {cuisineTypes.map(cuisine => (
              <div key={cuisine} className="flex items-center space-x-2">
                <Checkbox
                  id={cuisine}
                  checked={filters.excludedCuisines.includes(cuisine)}
                  onCheckedChange={() => handleCuisineToggle(cuisine)}
                />
                <label
                  htmlFor={cuisine}
                  className={`text-sm cursor-pointer ${
                    filters.excludedCuisines.includes(cuisine) 
                      ? 'line-through text-gray-400' 
                      : 'text-gray-700'
                  }`}
                >
                  {cuisine}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Minimum Rating */}
        <div>
          <h3 className="font-semibold mb-3">
            Minimum Rating: {filters.minRating > 0 ? `${filters.minRating}+ stars` : 'Any'}
          </h3>
          <Slider
            value={[filters.minRating]}
            onValueChange={handleRatingChange}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Any</span>
            <span>5.0</span>
          </div>
        </div>

        {/* Price Level */}
        <div>
          <h3 className="font-semibold mb-3">
            Max Price: {'$'.repeat(filters.maxPriceLevel)}
          </h3>
          <Slider
            value={[filters.maxPriceLevel]}
            onValueChange={handlePriceChange}
            max={4}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$</span>
            <span>$$$$</span>
          </div>
        </div>

        {/* Max Distance */}
        <div>
          <h3 className="font-semibold mb-3">
            Distance: {filters.maxDistance} km
          </h3>
          <Slider
            value={[filters.maxDistance]}
            onValueChange={handleDistanceChange}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 km</span>
            <span>10 km</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
