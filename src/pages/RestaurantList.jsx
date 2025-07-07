
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Restaurant, UserHistory } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Filter, Shuffle, Star, MapPin, Phone, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import CategoryFilter from "../components/restaurant/CategoryFilter";
import RestaurantCard from "../components/restaurant/RestaurantCard";
import RandomPicker from "../components/restaurant/RandomPicker";

const categoryColors = {
  "速食": "bg-red-100 text-red-800",
  "中式": "bg-yellow-100 text-yellow-800",
  "日式": "bg-pink-100 text-pink-800",
  "韓式": "bg-purple-100 text-purple-800",
  "異國": "bg-blue-100 text-blue-800",
  "甜點": "bg-green-100 text-green-800",
  "咖啡": "bg-amber-100 text-amber-800",
  "其他": "bg-gray-100 text-gray-800"
};

export default function RestaurantList() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]); // New state for dynamic categories
  const [excludedCategories, setExcludedCategories] = useState([]);
  const [minRating, setMinRating] = useState([4.0]);
  const [selectedPriceLevels, setSelectedPriceLevels] = useState([1, 2, 3, 4]); // New state for price level filter
  const [maxDistance, setMaxDistance] = useState([3000]); // New state for distance filter, default 3km
  const [showRandomPicker, setShowRandomPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mealType, setMealType] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mealTypeParam = urlParams.get('mealType');
    setMealType(mealTypeParam || '');
    
    loadCurrentUser();
    loadRestaurants();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [restaurants, excludedCategories, minRating, selectedPriceLevels, maxDistance]);

  // New useEffect to populate availableCategories based on loaded restaurants
  useEffect(() => {
    if (restaurants.length > 0) {
      const uniqueCategories = [...new Set(restaurants.map(r => r.category))];
      // 確保類別順序一致
      const categoryOrder = ["速食", "中式", "日式", "韓式", "異國", "甜點", "咖啡", "其他"];
      uniqueCategories.sort((a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b));
      setAvailableCategories(uniqueCategories);
    }
  }, [restaurants]);

  const loadCurrentUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log("用戶未登入");
    }
  };

  const loadRestaurants = async () => {
    setIsLoading(true);
    try {
      const data = await Restaurant.list();
      if (data.length === 0) {
        // 如果沒有餐廳資料，建立一些示例資料
        await createSampleRestaurants();
        const newData = await Restaurant.list();
        setRestaurants(newData);
      } else {
        setRestaurants(data);
      }
    } catch (error) {
      console.error("載入餐廳失敗:", error);
    }
    setIsLoading(false);
  };

  const createSampleRestaurants = async () => {
    const sampleRestaurants = [
      {
        name: "阿嬤的手作麵店",
        category: "中式",
        rating: 4.5,
        address: "台北市大安區忠孝東路四段123號",
        photoUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        phone: "02-2345-6789",
        distance: 300,
        openingHours: ["週一-週日 11:00-22:00"],
        latitude: 25.0330,
        longitude: 121.5654,
        priceLevel: 2
      },
      {
        name: "櫻花日式料理",
        category: "日式",
        rating: 4.2,
        address: "台北市信義區松仁路100號",
        photoUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
        phone: "02-2765-4321",
        distance: 500,
        openingHours: ["週一-週日 17:00-23:00"],
        latitude: 25.0370,
        longitude: 121.5674,
        priceLevel: 3
      },
      {
        name: "韓式烤肉天堂",
        category: "韓式",
        rating: 4.7,
        address: "台北市中山區南京東路二段456號",
        photoUrl: "https://images.unsplash.com/photo-1588349437398-6947c5c50c92?w=400",
        phone: "02-2567-8901",
        distance: 800,
        openingHours: ["週一-週日 16:00-01:00"],
        latitude: 25.0520,
        longitude: 121.5434,
        priceLevel: 2
      },
      {
        name: "義式小館",
        category: "異國",
        rating: 4.3,
        address: "台北市松山區市民大道五段789號",
        photoUrl: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400",
        phone: "02-2345-1234",
        distance: 1200,
        openingHours: ["週一-週日 11:30-22:00"],
        latitude: 25.0470,
        longitude: 121.5774,
        priceLevel: 3
      },
      {
        name: "精品咖啡屋",
        category: "咖啡",
        rating: 4.6,
        address: "台北市大安區敦化南路一段321號",
        photoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
        phone: "02-2705-6789",
        distance: 400,
        openingHours: ["週一-週日 07:00-21:00"],
        latitude: 25.0410,
        longitude: 121.5494,
        priceLevel: 2
      },
      {
        name: "法式甜點工房",
        category: "甜點",
        rating: 4.8,
        address: "台北市中正區羅斯福路三段654號",
        photoUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
        phone: "02-2362-5678",
        distance: 600,
        openingHours: ["週一-週日 09:00-20:00"],
        latitude: 25.0200,
        longitude: 121.5300,
        priceLevel: 3
      },
      {
        name: "麥當勞信義店", 
        category: "速食", 
        rating: 4.0, 
        address: "台北市信義區松仁路28號", 
        photoUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400", 
        phone: "02-2723-4567", 
        distance: 250, 
        openingHours: ["24小時營業"], 
        latitude: 25.0336, 
        longitude: 121.5645, 
        priceLevel: 1
      },
      {
        name: "鼎泰豐", 
        category: "中式", 
        rating: 4.6, 
        address: "台北市大安區信義路二段194號", 
        photoUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400", 
        phone: "02-2321-8928", 
        distance: 700, 
        openingHours: ["週一-週日 11:00-21:00"], 
        latitude: 25.0335, 
        longitude: 121.5285, 
        priceLevel: 3
      }
    ];

    for (const restaurant of sampleRestaurants) {
      await Restaurant.create(restaurant);
    }
  };

  const applyFilters = () => {
    let filtered = restaurants.filter(restaurant => {
      const categoryMatch = !excludedCategories.includes(restaurant.category);
      const ratingMatch = restaurant.rating >= minRating[0];
      const priceMatch = selectedPriceLevels.includes(restaurant.priceLevel) || selectedPriceLevels.length === 4;
      const distanceMatch = restaurant.distance <= maxDistance[0];
      return categoryMatch && ratingMatch && priceMatch && distanceMatch;
    });

    // 按類別分組
    const grouped = filtered.reduce((acc, restaurant) => {
      if (!acc[restaurant.category]) {
        acc[restaurant.category] = [];
      }
      acc[restaurant.category].push(restaurant);
      return acc;
    }, {});

    setFilteredRestaurants(grouped);
  };

  const handlePriceToggle = (level) => {
    setSelectedPriceLevels(prev => {
      const newLevels = prev.includes(level)
        ? prev.filter(p => p !== level)
        : [...prev, level];
      // 如果全部取消，則視為全選
      return newLevels.length === 0 ? [1, 2, 3, 4] : newLevels;
    });
  };

  const handleRestaurantSelect = async (restaurant) => {
    if (user) {
      await UserHistory.create({
        restaurantId: restaurant.id,
        mealType: getMealTypeDisplayName(mealType),
        actionType: "selected",
        timestamp: new Date().toISOString()
      });
    }
    navigate(createPageUrl(`RestaurantDetail?id=${restaurant.id}`));
  };

  const handleRandomPick = () => {
    const allFiltered = Object.values(filteredRestaurants).flat();
    if (allFiltered.length === 0) return;
    
    setShowRandomPicker(true);
  };

  const onRandomPickComplete = async (selectedRestaurant) => {
    if (user) {
      await UserHistory.create({
        restaurantId: selectedRestaurant.id,
        mealType: getMealTypeDisplayName(mealType),
        actionType: "randomPicked",
        timestamp: new Date().toISOString()
      });
    }
    setShowRandomPicker(false);
    navigate(createPageUrl(`RestaurantDetail?id=${selectedRestaurant.id}`));
  };

  const getMealTypeDisplayName = (type) => {
    const mapping = {
      'breakfast': '早餐',
      'lunch': '午餐', 
      'afternoon_tea': '下午茶',
      'dinner': '晚餐'
    };
    return mapping[type] || type;
  };

  const formatDistanceLabel = (meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} 公里`;
    }
    return `${meters} 公尺`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在搜尋附近餐廳...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Home"))}
            className="text-gray-600 hover:text-orange-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回
          </Button>
          <h1 className="text-xl font-bold text-gray-800">
            {getMealTypeDisplayName(mealType)}推薦
          </h1>
          <div className="w-16"></div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Card className="glass-morphism border-orange-200">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center">
                <Filter className="w-5 h-5 mr-2 text-orange-500" />
                <h3 className="font-semibold text-gray-800">篩選條件</h3>
              </div>
              
              <CategoryFilter
                categories={availableCategories} // Pass availableCategories dynamically
                excludedCategories={excludedCategories}
                onCategoryToggle={(category) => {
                  setExcludedCategories(prev => 
                    prev.includes(category) 
                      ? prev.filter(c => c !== category)
                      : [...prev, category]
                  );
                }}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最低評分: {minRating[0]}
                </label>
                <Slider
                  value={minRating}
                  onValueChange={setMinRating}
                  max={5}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  價格區間
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(level => (
                    <Button
                      key={level}
                      onClick={() => handlePriceToggle(level)}
                      variant={selectedPriceLevels.includes(level) ? "default" : "outline"}
                      className={`flex-1 ${selectedPriceLevels.includes(level) ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                      {'$'.repeat(level)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  距離上限: {formatDistanceLabel(maxDistance[0])}
                </label>
                <Slider
                  value={maxDistance}
                  onValueChange={setMaxDistance}
                  max={3000}
                  min={100}
                  step={100}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Restaurant List */}
        <div className="space-y-6">
          {Object.entries(filteredRestaurants).map(([category, restaurants]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <Badge className={`${categoryColors[category]} text-sm font-medium mr-3`}>
                  {category}
                </Badge>
                <div className="flex-1 h-px bg-orange-200"></div>
                <span className="text-sm text-gray-500 ml-3">
                  {restaurants.length} 間餐廳
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onClick={() => handleRestaurantSelect(restaurant)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {Object.keys(filteredRestaurants).length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              附近找不到符合條件的餐廳
            </h3>
            <p className="text-gray-500 mb-6">
              試試調整篩選條件或稍後再試
            </p>
            <Button
              onClick={loadRestaurants}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              重新搜尋
            </Button>
          </motion.div>
        )}
      </div>

      {/* Random Picker Button */}
      {Object.keys(filteredRestaurants).length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="fixed bottom-24 right-4"
        >
          <Button
            onClick={handleRandomPick}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full w-16 h-16 shadow-lg pulse-animation"
          >
            <Shuffle className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      {/* Random Picker Modal */}
      <AnimatePresence>
        {showRandomPicker && (
          <RandomPicker
            restaurants={Object.values(filteredRestaurants).flat()}
            onComplete={onRandomPickComplete}
            onClose={() => setShowRandomPicker(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
