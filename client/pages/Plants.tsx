import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  List,
  Grid,
  Plus,
  Database,
  MapPin,
  Calendar,
  User,
  Activity,
  Eye,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { plantApi } from "../../shared/api";
import { Plant } from "../../shared/types";

export default function Plants() {
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await plantApi.getPlantList();
      setPlants(response.plants);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch plants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Working":
        return "bg-green-100 text-green-800";
      case "Error":
        return "bg-red-100 text-red-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="app" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Plants</h1>
            <Button
              onClick={fetchPlants}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="relative px-8 py-16 text-white">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-4">
                Smart PV Energy Management
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Monitor and optimize your solar installations with real-time data
                and intelligent analytics for maximum efficiency.
              </p>
              <div className="flex gap-4">
                <Button className="bg-white text-blue-900 hover:bg-gray-100">
                  View Live Data
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-900"
                >
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute right-8 top-8 opacity-10">
            <div className="text-6xl font-bold transform rotate-12 text-white/30 mt-8 mr-8">
              ENERGY
            </div>
            <div className="text-4xl font-bold transform rotate-12 text-white/20 mt-4 mr-12">
              STORAGE
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-red-700">
                <p className="font-medium">Error loading plants</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Plants Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Plants Overview
                </h3>
                <p className="text-sm text-gray-600">Total: {plants.length} plants</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 mr-4">View</span>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="w-10 h-10 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="w-10 h-10 p-0"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Live Data
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading plants...</span>
              </div>
            ) : plants.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-600">No plants found</p>
              </div>
            ) : (
              <>
                {viewMode === "list" ? (
                  <div className="space-y-4">
                    {plants.map((plant) => (
                      <div
                        key={plant.uid}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Activity className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900">
                                  Plant #{plant.uid.substring(0, 8)}
                                </h4>
                                <Badge
                                  className={cn(
                                    "text-xs",
                                    getStatusColor(plant.status),
                                  )}
                                >
                                  {plant.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  Owner: {plant.owner.substring(0, 8)}...
                                </div>
                                <div className="flex items-center gap-1">
                                  <Database className="w-4 h-4" />
                                  {plant.device_amount} devices
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(plant.updated_at)}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                ID: {plant.uid}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-brand-teal-600 border-brand-teal-200 hover:bg-brand-teal-50"
                              asChild
                            >
                              <Link to={`/plants/${plant.uid}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plants.map((plant) => (
                      <Card
                        key={plant.uid}
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Activity className="w-5 h-5 text-gray-600" />
                            </div>
                            <Badge
                              className={cn(
                                "text-xs",
                                getStatusColor(plant.status),
                              )}
                            >
                              {plant.status}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Plant #{plant.uid.substring(0, 8)}
                          </h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              Owner: {plant.owner.substring(0, 8)}...
                            </div>
                            <div className="flex items-center gap-1">
                              <Database className="w-4 h-4" />
                              {plant.device_amount} devices
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(plant.updated_at)}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            {plant.uid}
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              className="bg-brand-teal-500 hover:bg-brand-teal-600 text-white"
                              asChild
                            >
                              <Link to={`/plants/${plant.uid}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* New Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quick Actions
                </h3>
                <p className="text-sm text-gray-600">
                  Get started with your energy monitoring
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Plant
                </Button>
                <Button
                  className="bg-brand-teal-500 hover:bg-brand-teal-600 text-white flex items-center gap-2"
                  size="sm"
                >
                  <Activity className="w-4 h-4" />
                  View Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="flex flex-col">
                  <span className="font-bold text-brand-teal-500 text-xl leading-none tracking-wide">
                    EDIS LAB
                  </span>
                  <span className="text-brand-blue-500 text-sm leading-none tracking-wide mt-1">
                    Monitoring
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Smart PV for solar, battery, and grid energy management.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Live Monitoring</li>
                <li>Reports</li>
                <li>Battery Insights</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About</li>
                <li>Contact</li>
                <li>Support</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Documentation</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 EDIS LAB APP. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
