import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, User as UserIcon, LogOut, Bell, Globe } from "lucide-react";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: true,
    location: true,
    language: 'zh-TW'
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log("用戶未登入");
    }
    setIsLoading(false);
  };

  const handleLogin = async () => {
    try {
      await User.login();
    } catch (error) {
      console.error("登入失敗:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null);
    } catch (error) {
      console.error("登出失敗:", error);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">載入設定...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <SettingsIcon className="w-8 h-8 text-orange-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">設定</h1>
          </div>
          <p className="text-gray-600">管理您的偏好設定</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* User Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-morphism border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      {user ? (
                        <>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {user.full_name}
                          </h3>
                          <p className="text-gray-600">{user.email}</p>
                        </>
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold text-gray-800">
                            訪客用戶
                          </h3>
                          <p className="text-gray-600">登入以保存資料</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    {user ? (
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        登出
                      </Button>
                    ) : (
                      <Button
                        onClick={handleLogin}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        登入
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* App Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-morphism border-orange-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  應用程式設定
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium text-gray-800">推播通知</p>
                        <p className="text-sm text-gray-600">接收新餐廳推薦</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications}
                      onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium text-gray-800">定位服務</p>
                        <p className="text-sm text-gray-600">允許獲取您的位置</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.location}
                      onCheckedChange={(checked) => handleSettingChange('location', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* App Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-morphism border-orange-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  關於應用程式
                </h3>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>版本</span>
                    <span>1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>開發者</span>
                    <span>今天要吃甚麼團隊</span>
                  </div>
                  <div className="flex justify-between">
                    <span>更新日期</span>
                    <span>2024-01-15</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}