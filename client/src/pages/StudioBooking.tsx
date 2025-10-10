import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Mic2, Users } from "lucide-react";
import { useState } from "react";
import CheckoutModal from "@/components/CheckoutModal";

export default function StudioBooking() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedPackage, setSelectedPackage] = useState<{ name: string; price: string } | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const packages = [
    {
      id: 1,
      name: "2-Hour Session",
      price: "$150",
      duration: "2 hours",
      description: "Perfect for singles and quick recordings",
      icon: Clock,
    },
    {
      id: 2,
      name: "4-Hour Session",
      price: "$280",
      duration: "4 hours",
      description: "Ideal for EPs and multiple tracks",
      icon: Mic2,
    },
    {
      id: 3,
      name: "Full Day Session",
      price: "$500",
      duration: "8 hours",
      description: "Complete album recording experience",
      icon: Users,
    },
  ];

  const handleBooking = (pkg: { name: string; price: string }) => {
    setSelectedPackage(pkg);
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Book Your Studio Session</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your session package and schedule your recording time at ThaFamilyBeats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="hover-elevate transition-all cursor-pointer" onClick={() => handleBooking({ name: pkg.name, price: pkg.price })}>
              <CardHeader>
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <pkg.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-display">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-mono font-bold">{pkg.price}</span>
                  <span className="text-muted-foreground ml-2">/ {pkg.duration}</span>
                </div>
                <Button className="w-full" data-testid={`button-book-${pkg.id}`}>Book Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Select Your Date</CardTitle>
            <CardDescription>Choose your preferred recording date from the calendar below</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
              data-testid="calendar-booking"
            />
          </CardContent>
        </Card>

        <div className="mt-12 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-chart-3 mr-2">✓</span>
                  Professional recording engineer
                </li>
                <li className="flex items-start">
                  <span className="text-chart-3 mr-2">✓</span>
                  State-of-the-art equipment (Neumann, SSL, UAD)
                </li>
                <li className="flex items-start">
                  <span className="text-chart-3 mr-2">✓</span>
                  Real-time monitoring and feedback
                </li>
                <li className="flex items-start">
                  <span className="text-chart-3 mr-2">✓</span>
                  High-quality audio files delivered within 24 hours
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedPackage && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          service={selectedPackage.name}
          price={selectedPackage.price}
        />
      )}
    </div>
  );
}
