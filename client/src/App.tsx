import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import StudioBooking from "@/pages/StudioBooking";
import ThaFamilyMixes from "@/pages/ThaFamilyMixes";
import SyncLicensing from "@/pages/SyncLicensing";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path="/">
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/studio-booking" component={StudioBooking} />
            <Route path="/thafamilymixes" component={ThaFamilyMixes} />
            <Route path="/sync-licensing" component={SyncLicensing} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
