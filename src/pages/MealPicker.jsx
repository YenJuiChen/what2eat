import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Coffee, Sun, Clock, Moon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MealPicker() {
  const navigate = useNavigate();
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const meals = [
    {
      id: "breakfast",
      name: "Breakfast",
      icon: Coffee,
      gradient: "from-amber-400 to-orange-500",
      description: "Start your day right",
      time: "6:00 AM - 11:00 AM"
    },
    {
      id: "lunch", 
      name: "Lunch",
      icon: Sun,
      gradient: "from-emerald-400 to-teal-500",
      description: "Midday fuel",
      time: "11:00 AM - 3:00 PM"
    },
    {
      id: "afternoon_tea",
      name: "Afternoon Tea",
      icon: Clock,
      gradient: "from-pink-400 to-purple-500",
      description: "Sweet afternoon treat",
      time: "2:00 PM - 5:00 PM"
    },
    {
      id: "dinner",
      name: "Dinner", 
      icon: Moon,
      gradient: "from-indigo-400 to-blue-500",
      description: "Evening delight",
      time: "5:00 PM - 10:00 PM"
    }
  ];

  const handleMealSelect = async (meal) => {
    setSelectedMeal(meal);
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Store meal selection and location in localStorage
      localStorage.setItem('selectedMeal', JSON.stringify({
        meal: meal.id,
        mealName: meal.name,
        location: { lat: latitude, lng: longitude },
        timestamp: new Date().toISOString()
      }));

      // Navigate to restaurant search
      navigate(createPageUrl("RestaurantSearch"));
      
    } catch (error) {
      setLocationError("Unable to get your location. Please enable location services and try again.");
      setIsGettingLocation(false);
      setSelectedMeal(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="text-center py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            What Should I Eat Today?
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Choose your meal and let us find the perfect spot for you!
          </p>
        </motion.div>
      </div>

      {/* Meal Selection */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
              Which meal are you planning for?
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {meals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                >
                  <Button
                    onClick={() => handleMealSelect(meal)}
                    disabled={isGettingLocation}
                    className={`meal-button w-full h-20 p-6 rounded-2xl bg-gradient-to-r ${meal.gradient} text-white border-none shadow-lg hover:shadow-xl relative overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center justify-between w-full relative z-10">
                      <div className="flex items-center gap-4">
                        <meal.icon className="w-8 h-8" />
                        <div className="text-left">
                          <div className="font-bold text-lg">{meal.name}</div>
                          <div className="text-sm opacity-90">{meal.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-90">{meal.time}</div>
                      </div>
                    </div>
                    {isGettingLocation && selectedMeal?.id === meal.id && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-white">
                          <MapPin className="w-5 h-5 animate-pulse" />
                          <span className="text-sm">Getting location...</span>
                        </div>
                      </div>
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Location Error */}
      {locationError && (
        <div className="px-6 pb-6">
          <Alert className="max-w-lg mx-auto border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {locationError}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}