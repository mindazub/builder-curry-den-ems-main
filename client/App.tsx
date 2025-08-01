import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Plants from "./pages/Plants";
import PlantDetails from "./pages/PlantDetails";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ApiTest from "./pages/ApiTest";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { SettingsProvider } from "./context/SettingsContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/index" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/plants" element={
                <ProtectedRoute>
                  <Plants />
                </ProtectedRoute>
              } />
              <Route path="/plants/:id" element={
                <ProtectedRoute>
                  <PlantDetails />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/api-test" element={
                <ProtectedRoute>
                  <ApiTest />
                </ProtectedRoute>
              } />
              <Route path="/devices" element={
                <ProtectedRoute>
                  <div>Devices placeholder</div>
                </ProtectedRoute>
              } />
              <Route path="/roles" element={
                <ProtectedRoute adminOnly>
                  <div>Roles placeholder</div>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <div>Admin placeholder</div>
                </ProtectedRoute>
              } />
              <Route path="/docs" element={
                <ProtectedRoute>
                  <div>Documentation placeholder</div>
                </ProtectedRoute>
              } />
              <Route path="/devices-by-feed" element={
                <ProtectedRoute>
                  <div>Devices by Feed placeholder</div>
                </ProtectedRoute>
              } />
              <Route path="/backup" element={
                <ProtectedRoute adminOnly>
                  <div>Backup placeholder</div>
                </ProtectedRoute>
              } />
              <Route path="/customers" element={
                <ProtectedRoute adminOnly>
                  <div>Customers placeholder</div>
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
