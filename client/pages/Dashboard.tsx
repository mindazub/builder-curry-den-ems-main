import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Grid,
  List,
  Calendar,
  Activity,
  Settings,
  TrendingUp,
  RefreshCw,
  Loader2,
  Eye,
  BarChart3,
  Database,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { plantApi } from "../../shared/api";
import { Plant } from "../../shared/types";
import { useAuth } from "@/context/AuthContext";

const ITEMS_PER_PAGE = 12;

export default function Dashboard() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await plantApi.getPlantList();
      setPlants(response.plants);
      setFilteredPlants(response.plants);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch plants");
      setPlants([]);
      setFilteredPlants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  // Filter plants based on search and status
  useEffect(() => {
    let filtered = plants;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (plant) =>
          plant.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plant.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((plant) => {
        if (statusFilter === "active") {
          return plant.status === "Working";
        } else if (statusFilter === "inactive") {
          return plant.status === "Error" || plant.status === "Maintenance";
        }
        return true;
      });
    }

    setFilteredPlants(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [plants, searchTerm, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPlants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPlants = filteredPlants.slice(startIndex, endIndex);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (plant: Plant) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "Working":
          return "bg-green-100 text-green-800 border-green-200";
        case "Error":
          return "bg-red-100 text-red-800 border-red-200";
        case "Maintenance":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <Badge className={cn("text-xs", getStatusColor(plant.status))}>
        {plant.status}
      </Badge>
    );
  };

  const getTotalStats = () => {
    const totalDevices = filteredPlants.reduce((sum, plant) => sum + plant.device_amount, 0);
    const workingPlants = filteredPlants.filter(plant => plant.status === "Working").length;
    
    return { totalDevices, workingPlants };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-teal-500" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="text-gray-600">
            Monitor and manage your solar plant portfolio
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Plants</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredPlants.length}</div>
              <p className="text-xs text-muted-foreground">
                {stats.workingPlants} working plants
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDevices}</div>
              <p className="text-xs text-muted-foreground">
                Connected devices
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {plants.length > 0 ? Math.round((stats.workingPlants / plants.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Plants operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Search Plants
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by plant ID or owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="min-w-[150px]">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status Filter
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plants</SelectItem>
                    <SelectItem value="active">Working</SelectItem>
                    <SelectItem value="inactive">Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchPlants}
                  disabled={loading}
                >
                  <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                <p className="font-medium">Error loading plants</p>
                <p className="text-sm mt-1">{error}</p>
                <Button onClick={fetchPlants} className="mt-4" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plants Display */}
        {viewMode === "cards" ? (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentPlants.map((plant) => (
              <Card key={plant.uid} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold truncate">
                        Plant #{plant.uid.substring(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <User className="h-3 w-3 mr-1" />
                        {plant.owner.substring(0, 8)}...
                      </p>
                    </div>
                    {getStatusBadge(plant)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Devices</span>
                      <span className="font-medium">{plant.device_amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="font-medium">{plant.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Last Update</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(plant.updated_at)}
                      </span>
                    </div>
                    <div className="pt-3 border-t">
                      <Button asChild className="w-full" size="sm">
                        <Link to={`/plants/${plant.uid}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Table View */
          <Card className="mb-8">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plant ID</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Devices</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPlants.map((plant) => (
                    <TableRow key={plant.uid}>
                      <TableCell className="font-medium">
                        #{plant.uid.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1 text-gray-400" />
                          {plant.owner.substring(0, 12)}...
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(plant)}</TableCell>
                      <TableCell>{plant.device_amount}</TableCell>
                      <TableCell>{formatDate(plant.updated_at)}</TableCell>
                      <TableCell>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/plants/${plant.uid}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && filteredPlants.length === 0 && (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
                <p className="text-gray-600 mb-6">
                  {plants.length === 0 
                    ? "Get started by adding your first solar plant to the system."
                    : "Try adjusting your search terms or filters."
                  }
                </p>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }} variant="outline">
                    Clear Filters
                  </Button>
                  <Button onClick={fetchPlants}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={cn(
                      currentPage === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={cn(
                      currentPage === totalPages && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
