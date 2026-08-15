import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  price?: string;
  features: string[];
  onBook: () => void;
  actionLabel?: string;
}

export default function ServiceCard({ icon: Icon, title, description, price, features, onBook, actionLabel = "Book Now" }: ServiceCardProps) {
  return (
    <Card className="hover-elevate transition-all duration-300">
      <CardHeader>
        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="font-display text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {price && (
          <div className="mb-4">
            <span className="text-3xl font-mono font-bold">{price}</span>
          </div>
        )}
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-start">
              <span className="text-chart-3 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button onClick={onBook} className="w-full" data-testid={`button-book-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
