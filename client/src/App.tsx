import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";

// Pages
import Dashboard from "@/pages/Dashboard";
import CycleTracking from "@/pages/CycleTracking";
import PregnancyTracking from "@/pages/PregnancyTracking";
import Wellness from "@/pages/Wellness";
import AIAssistant from "@/pages/AIAssistant";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/cycle" component={CycleTracking} />
        <Route path="/pregnancy" component={PregnancyTracking} />
        <Route path="/wellness" component={Wellness} />
        <Route path="/ai" component={AIAssistant} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
