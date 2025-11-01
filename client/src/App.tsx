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
      <Route path="/admin" component={Admin} />
      <Route path="/studio-booking">
        <Layout><StudioBooking /></Layout>
      </Route>
      <Route path="/thafamilymixes">
        <Layout><ThaFamilyMixes /></Layout>
      </Route>
      <Route path="/sync-licensing">
        <Layout><SyncLicensing /></Layout>
      </Route>
      <Route path="/about">
        <Layout><About /></Layout>
      </Route>
      <Route path="/contact">
        <Layout><Contact /></Layout>
      </Route>
      <Route path="/">
        <Layout><Home /></Layout>
      </Route>
      <Route>
        <Layout><NotFound /></Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
