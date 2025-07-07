import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink,
  Shuffle,
  Share2
} from "lucide-react";

export default function RestaurantResult() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [mealData, setMealData] = useState(null);

  useEffect(() => {
    const storedRestaurant = localStorage.getItem('selectedRestaurant');
    const storedMealData = localStorage.getItem('selectedMeal');
    
    if (!storedRestaurant) {
      navigate(createPageUrl("RestaurantSearch"));
      return;
    }
    
    setRestaurant(JSON.parse(storedRestaurant));
    if (storedMealData) {
      setMealData(JSON.parse(storedMealData));
    }
  }, []);

  const getPriceLevel = (level) => {
    return '$'.repeat(level || 1);
  };

  const getCuisineColor = (cuisine) => {
    const colors = {
      'Fast Food': 'bg-red-100 text-red-800',
      'Chinese': 'bg-yellow-100 text-yellow-800',
      'Japanese': 'bg-pink-100 text-pink-800',
      'Italian': 'bg-green-100 text-green-800',
      'Mexican': 'bg-orange-100 text-orange-800',
      'Thai': 'bg-purple-100 text-purple-800',
      'Indian': 'bg-amber-100 text-amber-800',
      'American': 'bg-blue-100 text-blue-800',
      'Café & Dessert': 'bg-rose-100 text-rose-800',
      'Western': 'bg-gray-100 text-gray-800',
      'Korean': 'bg-teal-100 text-teal-800',
      'Vietnamese': 'bg-lime-100 text-lime-800',
      'Mediterranean': 'bg-cyan-100 text-cyan-800'
    };
    return colors[cuisine] || 'bg-gray-100 text-gray-800';
  };

  const handleSpinAgain = () => {
    navigate(createPageUrl("RestaurantSearch"));
  };

  const handleShare = async () => {
    if (!restaurant) return;
    
    const shareText = `Check out ${restaurant.name} for ${mealData?.mealName || 'a meal'}! 
${restaurant.address}
Rating: ${restaurant.rating}/5 ⭐
${restaurant.google_maps_url}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${restaurant.name} - Perfect for ${mealData?.mealName}`,
          text: shareText,
          url: restaurant.google_maps_url
        });
      } catch (err) {
        console.log('Error sharing:', err);
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Restaurant info copied to clipboard!');
    });
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(createPageUrl("RestaurantSearch"))}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
            <Button
              variant="ghost"
              onClick={handleShare}
              className="text-white hover:bg-white/20"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              🎉 Perfect Match Found!
            </h1>
            <p className="text-green-100">
              Your ideal spot for {mealData?.mealName}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="overflow-hidden shadow-xl">
            {/* Hero Image */}
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
              <img 
                src={restaurant.photo_url}
                alt={restaurant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            <CardContent className="p-6">
              {/* Restaurant Name & Cuisine */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {restaurant.name}
                </h2>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getCuisineColor(restaurant.cuisine_type)}>
                    {restaurant.cuisine_type}
                  </Badge>
                  <Badge variant="outline" className="text-gray-600">
                    {getPriceLevel(restaurant.price_level)}
                  </Badge>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-lg">{restaurant.rating}</span>
                </div>
                <span className="text-gray-500">
                  ({restaurant.review_count} reviews)
                </span>
              </div>

              {/* Details */}
              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">{restaurant.address}</p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600 hover:text-blue-800"
                      onClick={() => window.open(restaurant.google_maps_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open in Google Maps
                    </Button>
                  </div>
                </div>

                {/* Phone */}
                {restaurant.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">{restaurant.phone}</p>
                    </div>
                  </div>
                )}

                {/* Opening Hours */}
                {restaurant.opening_hours && restaurant.opening_hours.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Opening Hours</p>
                      <div className="text-gray-600 text-sm space-y-1">
                        {restaurant.opening_hours.slice(0, 3).map((hour, index) => (
                          <p key={index}>{hour}</p>
                        ))}
                        {restaurant.opening_hours.length > 3 && (
                          <p className="text-gray-500">+ {restaurant.opening_hours.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <Button
                  onClick={handleSpinAgain}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-full font-semibold"
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  Spin Again
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate(createPageUrl("MealPicker"))}
                  className="w-full border-2 border-gray-200 hover:bg-gray-50"
                >
                  Choose Different Meal
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}