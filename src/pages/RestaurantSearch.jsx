import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { InvokeLLM } from "@/api/integrations";
import { Restaurant } from "@/api/entities";
import RestaurantList from "../components/restaurant/RestaurantList";
import RestaurantFilters from "../components/restaurant/RestaurantFilters";
import SpinWheel from "../components/restaurant/SpinWheel";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Shuffle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RestaurantSearch() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    excludedCuisines: [],
    minRating: 0,
    maxPriceLevel: 4
  });
  const [mealData, setMealData] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    const storedMealData = localStorage.getItem('selectedMeal');
    if (!storedMealData) {
      navigate(createPageUrl("MealPicker"));
      return;
    }
    
    const parsedMealData = JSON.parse(storedMealData);
    setMealData(parsedMealData);
    
    loadRestaurants(parsedMealData);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [restaurants, filters]);

  const loadRestaurants = async (mealData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const prompt = `Find restaurants near coordinates ${mealData.location.lat}, ${mealData.location.lng} within 3km radius that are suitable for ${mealData.mealName}. 
      
      Please provide realistic restaurant data including:
      - Restaurant name
      - Cuisine type (categorize as: Fast Food, Chinese, Japanese, Italian, Mexican, Thai, Indian, American, Café & Dessert, Western, Korean, Vietnamese, Mediterranean, etc.)
      - Rating (between 3.5-5.0)
      - Number of reviews (realistic numbers)
      - Price level (1-4, where 1=$ and 4=$$$$)
      - Address
      - Phone number
      - Opening hours for each day
      - Latitude and longitude (near the provided coordinates)
      
      Focus on restaurants that would be open and appropriate for ${mealData.mealName} at typical meal times.`;

      const result = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            restaurants: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  cuisine_type: { type: "string" },
                  rating: { type: "number" },
                  review_count: { type: "number" },
                  price_level: { type: "number" },
                  address: { type: "string" },
                  phone: { type: "string" },
                  opening_hours: {
                    type: "array",
                    items: { type: "string" }
                  },
                  latitude: { type: "number" },
                  longitude: { type: "number" }
                }
              }
            }
          }
        }
      });

      if (result.restaurants && result.restaurants.length > 0) {
        const processedRestaurants = result.restaurants.map(restaurant => ({
          ...restaurant,
          place_id: `place_${Math.random().toString(36).substr(2, 9)}`,
          photo_url: `https://images.unsplash.com/400x300/?${restaurant.cuisine_type.toLowerCase()}+restaurant+food`,
          google_maps_url: `https://www.google.com/maps/search/${encodeURIComponent(restaurant.name + ' ' + restaurant.address)}`
        }));
        
        setRestaurants(processedRestaurants);
        
        // Store in localStorage for persistence
        localStorage.setItem('currentRestaurants', JSON.stringify(processedRestaurants));
      } else {
        setError("No restaurants found in your area. Please try a different location.");
      }
    } catch (err) {
      setError("Failed to load restaurants. Please try again.");
      console.error('Error loading restaurants:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = restaurants.filter(restaurant => {
      const ratingMatch = restaurant.rating >= filters.minRating;
      const priceMatch = restaurant.price_level <= filters.maxPriceLevel;
      const cuisineMatch = !filters.excludedCuisines.includes(restaurant.cuisine_type);
      
      return ratingMatch && priceMatch && cuisineMatch;
    });
    
    setFilteredRestaurants(filtered);
  };

  const handleSpin = async () => {
    if (filteredRestaurants.length === 0) return;
    
    setIsSpinning(true);
    
    // Simulate spin animation delay
    setTimeout(async () => {
      const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
      const selected = filteredRestaurants[randomIndex];
      
      // Save to restaurant history
      try {
        await Restaurant.create({
          ...selected,
          selected_for_meal: mealData.mealName,
          selected_date: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error saving restaurant:', err);
      }
      
      setSelectedRestaurant(selected);
      setIsSpinning(false);
      
      // Navigate to result page
      localStorage.setItem('selectedRestaurant', JSON.stringify(selected));
      navigate(createPageUrl("RestaurantResult"));
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-pink-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Finding amazing restaurants...</h2>
          <p className="text-gray-500">This might take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Alert className="border-red-200 bg-red-50 mb-4">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => navigate(createPageUrl("MealPicker"))}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Meal Selection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(createPageUrl("MealPicker"))}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="text-sm">Near you</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Perfect spots for {mealData?.mealName}
          </h1>
          <p className="text-pink-100">
            Found {filteredRestaurants.length} restaurants • Ready to spin?
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Filters */}
        <RestaurantFilters
          restaurants={restaurants}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Spin Button */}
        <div className="text-center">
          <Button
            onClick={handleSpin}
            disabled={isSpinning || filteredRestaurants.length === 0}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {isSpinning ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Spinning...
              </>
            ) : (
              <>
                <Shuffle className="w-6 h-6 mr-2" />
                Spin to Choose!
              </>
            )}
          </Button>
        </div>

        {/* Spin Animation */}
        <AnimatePresence>
          {isSpinning && (
            <SpinWheel restaurants={filteredRestaurants} />
          )}
        </AnimatePresence>

        {/* Restaurant List */}
        <RestaurantList restaurants={filteredRestaurants} />
      </div>
    </div>
  );
}