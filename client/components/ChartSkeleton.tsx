import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ChartSkeletonProps {
  title: string;
  height?: string;
  showTabs?: boolean;
  showDownload?: boolean;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  title,
  height = "h-[29.25rem]",
  showTabs = true,
  showDownload = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Card className="relative overflow-hidden">
        {/* Shimmer Overlay Effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            <motion.div 
              className="h-6 bg-gray-300 rounded w-48"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </CardTitle>
          {showDownload && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="p-1 h-8 w-8" disabled>
                <Download className="w-4 h-4 opacity-50" />
              </Button>
            </div>
          )}
        </CardHeader>

        {/* Tab Navigation Skeleton */}
        {showTabs && (
          <div className="flex border-b border-gray-200 px-6">
            <div className="px-4 py-2">
              <motion.div 
                className="h-4 bg-gray-300 rounded w-12"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
            </div>
            <div className="px-4 py-2">
              <motion.div 
                className="h-4 bg-gray-300 rounded w-12"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
            </div>
          </div>
        )}

        <CardContent>
          <div className={`${height} relative overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 rounded-lg`}>
            {/* Chart Area Skeleton with Animated Lines */}
            <div className="absolute inset-0 p-6">
              {/* Y-Axis Labels */}
              <div className="absolute left-2 top-6 bottom-6 flex flex-col justify-between">
                {[...Array(6)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="h-3 bg-gray-300 rounded w-8"
                    animate={{ opacity: [0.6, 0.9, 0.6] }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.3 
                    }}
                  />
                ))}
              </div>

              {/* Chart Grid */}
              <div className="ml-12 mr-4 h-full relative">
                {/* Horizontal Grid Lines */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-full border-b border-gray-200"
                    style={{ top: `${(i * 100) / 5}%` }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ 
                      duration: 1.5, 
                      ease: "easeInOut",
                      delay: i * 0.1 
                    }}
                  />
                ))}

                {/* Animated Chart Line Skeletons */}
                <div className="absolute inset-0">
                  {/* Primary Line with Path Animation */}
                  <motion.svg 
                    className="w-full h-full" 
                    viewBox="0 0 400 200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ duration: 1.5 }}
                  >
                    <motion.path
                      d="M 0,150 Q 50,120 100,100 T 200,80 T 300,60 T 400,40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray="400"
                      strokeDashoffset="400"
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                    />
                  </motion.svg>

                  {/* Secondary Line */}
                  <motion.svg 
                    className="w-full h-full absolute inset-0" 
                    viewBox="0 0 400 200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ duration: 1.5, delay: 0.7 }}
                  >
                    <motion.path
                      d="M 0,100 Q 50,80 100,90 T 200,70 T 300,50 T 400,30"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray="400"
                      strokeDashoffset="400"
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ 
                        duration: 4, 
                        ease: "easeInOut", 
                        repeat: Infinity, 
                        repeatType: "reverse",
                        delay: 0.7 
                      }}
                    />
                  </motion.svg>

                  {/* Third Line */}
                  <motion.svg 
                    className="w-full h-full absolute inset-0" 
                    viewBox="0 0 400 200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ duration: 1.5, delay: 1.4 }}
                  >
                    <motion.path
                      d="M 0,120 Q 50,100 100,110 T 200,90 T 300,70 T 400,50"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeDasharray="400"
                      strokeDashoffset="400"
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ 
                        duration: 4, 
                        ease: "easeInOut", 
                        repeat: Infinity, 
                        repeatType: "reverse",
                        delay: 1.4 
                      }}
                    />
                  </motion.svg>
                </div>

                {/* Animated Data Points */}
                <div className="absolute inset-0">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-blue-400 rounded-full"
                      style={{
                        left: `${(i * 100) / 11}%`,
                        top: `${30 + Math.random() * 40}%`,
                      }}
                      animate={{ 
                        scale: [0.9, 1.1, 0.9],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* X-Axis Labels */}
              <div className="absolute bottom-2 left-12 right-4 flex justify-between">
                {[...Array(6)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="h-3 bg-gray-300 rounded w-12"
                    animate={{ opacity: [0.6, 0.9, 0.6] }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.3 + 1
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Loading Overlay with Enhanced Animation */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <motion.div 
                    className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div 
                    className="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-green-500 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <motion.div 
                  className="text-sm text-gray-600 font-medium"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  Loading chart data...
                </motion.div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Mini chart skeleton for smaller charts
export const MiniChartSkeleton: React.FC = () => {
  return (
    <div className="h-24 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg relative overflow-hidden animate-pulse">
      <div className="absolute inset-0 p-2">
        <svg className="w-full h-full" viewBox="0 0 200 80">
          <path
            d="M 0,60 Q 25,40 50,45 T 100,35 T 150,25 T 200,20"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            opacity="0.4"
            className="animate-pulse"
          />
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default ChartSkeleton;