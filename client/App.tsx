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
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/plants/:id" element={<PlantDetails />} />
          <Route path="/devices" element={<div>Devices placeholder</div>} />
          <Route path="/roles" element={<div>Roles placeholder</div>} />
          <Route path="/admin" element={<div>Admin placeholder</div>} />
          <Route path="/docs" element={<div>Documentation placeholder</div>} />
          <Route
            path="/devices-by-feed"
            element={<div>Devices by Feed placeholder</div>}
          />
          <Route path="/backup" element={<div>Backup placeholder</div>} />
          <Route path="/customers" element={<div>Customers placeholder</div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
