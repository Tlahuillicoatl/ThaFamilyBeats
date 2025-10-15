import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import CheckoutModal from "@/components/CheckoutModal";

export default function ThaFamilyMixes() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({ name: "", price: "" });

  const packages = [
    {
      id: 1,
      name: "Mixing",
      price: "$350",
      icon: Headphones,
      popular: true,
      features: [
        "Professional mixing",
        "Unlimited revisions",
        "Stereo mix file",
        "Fast turnaround",
      ],
    },
    {
      id: 2,
      name: "Mastering",
      price: "Contact for pricing",
      icon: Sparkles,
      features: [
        "Professional mastering",
        "Radio-ready quality",
        "Multiple format delivery",
        "Industry standard loudness",
      ],
    },
    {
      id: 3,
      name: "Mix + Master Bundle",
      price: "Contact for pricing",
      icon: Zap,
      features: [
        "Complete professional mixing",
        "Professional mastering",
        "Unlimited revisions",
        "All file formats",
        "Priority turnaround",
      ],
    },
  ];

  const handleBooking = (pkg: { name: string; price: string }) => {
    if (pkg.price === "Contact for pricing") {
      window.location.href = "/contact";
      return;
    }
    setSelectedPackage(pkg);
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">ThaFamilyMixes</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional mixing and mastering services to make your tracks radio-ready and sound incredible on any platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={`hover-elevate transition-all ${pkg.popular ? 'border-ring' : ''} relative`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-ring text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <CardHeader>
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <pkg.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-display text-xl">{pkg.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-mono font-bold text-foreground">{pkg.price}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-chart-3 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleBooking({ name: pkg.name, price: pkg.price })}
                  className="w-full"
                  variant={pkg.popular ? "default" : "outline"}
                  data-testid={`button-book-${pkg.id}`}
                >
                  {pkg.price === "Contact for pricing" ? "Contact Us" : "Book Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl">Our Mixing Process</CardTitle>
              <CardDescription>How we transform your tracks into professional releases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-mono font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-display font-semibold mb-2">Upload Your Stems</h3>
                  <p className="text-muted-foreground text-sm">
                    Send us your individual track stems and reference tracks for the sound you're aiming for.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-mono font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-display font-semibold mb-2">Professional Mixing</h3>
                  <p className="text-muted-foreground text-sm">
                    Our experienced engineers craft your mix using industry-standard tools and techniques.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-mono font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-display font-semibold mb-2">Revisions & Mastering</h3>
                  <p className="text-muted-foreground text-sm">
                    Review your mix, request changes, and receive the final mastered track ready for release.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        service={selectedPackage.name}
        price={selectedPackage.price}
      />
    </div>
  );
}
