
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Restaurant, UserHistory } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Star, RotateCcw, Heart, Shuffle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function History() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [restaurants, setRestaurants] = useState({});
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState(new Set());
  const [deletedRecordIds, setDeletedRecordIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const [historyRecords, restaurantRecords, favoriteRecords, deletedRecords] = await Promise.all([
        UserHistory.filter({ created_by: currentUser.email }, '-created_date'),
        Restaurant.list(),
        UserHistory.filter({ 
          created_by: currentUser.email, 
          actionType: 'favorited' 
        }),
        UserHistory.filter({ 
          created_by: currentUser.email, 
          actionType: 'deleted' 
        })
      ]);
      
      // 建立餐廳 ID 到餐廳資料的映射
      const restaurantMap = {};
      restaurantRecords.forEach(restaurant => {
        restaurantMap[restaurant.id] = restaurant;
      });
      
      // 建立收藏餐廳的 Set
      const favoriteIds = new Set(favoriteRecords.map(record => record.restaurantId));
      
      // 建立已刪除記錄的 Set
      const deletedIds = new Set(deletedRecords.map(record => record.targetRecordId));
      
      // 過濾掉已刪除的記錄
      const filteredHistoryData = historyRecords.filter(record => 
        !deletedIds.has(record.id) && record.actionType !== 'deleted'
      );
      
      setHistoryData(filteredHistoryData);
      setRestaurants(restaurantMap);
      setFavoriteRestaurantIds(favoriteIds);
      setDeletedRecordIds(deletedIds);
    } catch (error) {
      console.error("載入歷史記錄失敗:", error);
    }
    setIsLoading(false);
  };

  const handleFavoriteToggle = async (restaurantId) => {
    if (!user) return;
    
    try {
      const isFavorited = favoriteRestaurantIds.has(restaurantId);
      
      if (isFavorited) {
        // 移除收藏 - 標記所有該餐廳的收藏記錄為已刪除
        const favoriteRecordsToDelete = historyData.filter(record => 
          record.restaurantId === restaurantId && record.actionType === 'favorited'
        );
        
        for (const record of favoriteRecordsToDelete) {
          await UserHistory.create({
            restaurantId: restaurantId,
            actionType: "deleted",
            timestamp: new Date().toISOString(),
            targetRecordId: record.id
          });
        }
        
        setFavoriteRestaurantIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(restaurantId);
          return newSet;
        });
      } else {
        // 添加收藏
        await UserHistory.create({
          restaurantId: restaurantId,
          actionType: "favorited",
          timestamp: new Date().toISOString()
        });
        
        setFavoriteRestaurantIds(prev => new Set([...prev, restaurantId]));
      }
    } catch (error) {
      console.error("收藏操作失敗:", error);
    }
  };

  const handleDeleteRecord = async (record) => {
    try {
      // 建立刪除標記
      await UserHistory.create({
        restaurantId: record.restaurantId,
        actionType: "deleted",
        timestamp: new Date().toISOString(),
        targetRecordId: record.id
      });
      
      // 從本地狀態移除
      setHistoryData(prev => prev.filter(r => r.id !== record.id));
      setDeletedRecordIds(prev => new Set([...prev, record.id]));
      
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    } catch (error) {
      console.error("刪除記錄失敗:", error);
    }
  };

  const confirmDelete = (record) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'selected':
        return <MapPin className="w-4 h-4" />;
      case 'randomPicked':
        return <Shuffle className="w-4 h-4" />;
      case 'favorited':
        return <Heart className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActionText = (actionType) => {
    switch (actionType) {
      case 'selected':
        return '選擇了';
      case 'randomPicked':
        return '抽中了';
      case 'favorited':
        return '收藏了';
      default:
        return '訪問了';
    }
  };

  const getActionColor = (actionType) => {
    switch (actionType) {
      case 'selected':
        return 'bg-blue-100 text-blue-800';
      case 'randomPicked':
        return 'bg-purple-100 text-purple-800';
      case 'favorited':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(createPageUrl(`RestaurantDetail?id=${restaurantId}`));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            請先登入查看歷史記錄
          </h3>
          <Button
            onClick={() => User.login()}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            立即登入
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">載入歷史記錄...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">歷史記錄</h1>
          <p className="text-gray-600">回顧您的美食探索之旅</p>
        </div>

        {/* History List */}
        {historyData.length > 0 ? (
          <div className="space-y-4">
            {historyData.map((record, index) => {
              const restaurant = restaurants[record.restaurantId];
              if (!restaurant) return null;

              const isFavorited = favoriteRestaurantIds.has(restaurant.id);

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass-morphism border-orange-200 hover:border-orange-400 transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={restaurant.photoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100"}
                          alt={restaurant.name}
                          className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                          onClick={() => handleRestaurantClick(restaurant.id)}
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 
                              className="font-semibold text-gray-800 cursor-pointer hover:text-orange-600 transition-colors"
                              onClick={() => handleRestaurantClick(restaurant.id)}
                            >
                              {restaurant.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={getActionColor(record.actionType)}>
                                {getActionIcon(record.actionType)}
                                <span className="ml-1">
                                  {getActionText(record.actionType)}
                                </span>
                              </Badge>
                              
                              {/* 收藏按鈕 */}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleFavoriteToggle(restaurant.id)}
                                className={`h-8 w-8 rounded-full transition-all duration-200 ${
                                  isFavorited 
                                    ? "bg-red-100 text-red-600 hover:bg-red-200" 
                                    : "text-gray-400 hover:bg-gray-100 hover:text-red-500"
                                }`}
                              >
                                <Heart 
                                  className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} 
                                />
                              </Button>

                              {/* 刪除按鈕 */}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => confirmDelete(record)}
                                className="h-8 w-8 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span>{restaurant.rating}</span>
                            </div>
                            {record.mealType && <span>{record.mealType}</span>}
                            <span>
                              {format(new Date(record.created_date), 'MM/dd HH:mm')}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-500 mt-1">
                            {restaurant.address}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              還沒有歷史記錄
            </h3>
            <p className="text-gray-500 mb-6">
              開始探索美食，建立您的專屬記錄吧！
            </p>
            <Button
              onClick={() => navigate(createPageUrl("Home"))}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              開始尋找美食
            </Button>
          </motion.div>
        )}
      </div>

      {/* 刪除確認對話框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認刪除</AlertDialogTitle>
            <AlertDialogDescription>
              您確定要刪除這筆記錄嗎？此操作無法復原。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => recordToDelete && handleDeleteRecord(recordToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              確認刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
