import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import CheckoutModal from "@/components/CheckoutModal";

export default function StudioBooking() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hours, setHours] = useState(2);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const pricePerHour = 75;
  const totalPrice = hours * pricePerHour;

  const handleHoursChange = (change: number) => {
    const newHours = hours + change;
    if (newHours >= 1 && newHours <= 12) {
      setHours(newHours);
    }
  };

  const handleBooking = () => {
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

        <Card className="max-w-2xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Select Your Hours</CardTitle>
            <CardDescription>Choose how many studio hours you need (1-12 hours at ${pricePerHour}/hour)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm uppercase tracking-wide text-muted-foreground mb-3 block">Number of Hours</Label>
              <div className="flex items-center justify-center gap-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleHoursChange(-1)}
                  disabled={hours <= 1}
                  data-testid="button-decrease-hours"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="text-center min-w-[120px]">
                  <div className="text-5xl font-display font-bold" data-testid="text-hours">{hours}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {hours === 1 ? 'hour' : 'hours'}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleHoursChange(1)}
                  disabled={hours >= 12}
                  data-testid="button-increase-hours"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-card border border-card-border rounded-md p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Price per hour</span>
                <span className="font-mono">${pricePerHour}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="font-display">Total Price</span>
                <span className="font-mono" data-testid="text-total-price">${totalPrice}</span>
              </div>
            </div>

            <Button onClick={handleBooking} className="w-full" size="lg" data-testid="button-book-session">
              Book {hours} {hours === 1 ? 'Hour' : 'Hours'} for ${totalPrice}
            </Button>
          </CardContent>
        </Card>

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

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        service={`Studio Session - ${hours} ${hours === 1 ? 'Hour' : 'Hours'}`}
        price={`$${totalPrice}`}
        serviceType="studio_booking"
        sessionDate={date ? date.toISOString() : undefined}
        hours={hours}
      />
    </div>
  );
}
