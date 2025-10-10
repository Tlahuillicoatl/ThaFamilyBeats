import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-display font-bold mb-4">404</h1>
        <p className="text-2xl text-muted-foreground mb-8">Page Not Found</p>
        <Link href="/">
          <Button size="lg" className="gap-2" data-testid="button-home">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
