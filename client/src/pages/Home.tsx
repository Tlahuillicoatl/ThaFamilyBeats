import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Mic, Music, Headphones, ChevronRight } from "lucide-react";
import logoPath from "@assets/TFB HD_1760135611354.png";
import ServiceCard from "@/components/ServiceCard";
import { useState } from "react";
import CheckoutModal from "@/components/CheckoutModal";

export default function Home() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({ name: "", price: "" });

  const openCheckout = (service: string, price: string) => {
    setSelectedService({ name: service, price });
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen">
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <img src={logoPath} alt="ThaFamilyBeats" className="w-64 md:w-96 mx-auto mb-8" />
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Where Sound Meets <span className="text-ring">Excellence</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional recording studio delivering premium sound quality and exceptional service for artists, producers, and creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/studio-booking">
              <Button size="lg" className="gap-2" data-testid="button-book-session">
                Book a Session
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sync-licensing">
              <Button size="lg" variant="outline" className="gap-2 backdrop-blur-sm" data-testid="button-browse-beats">
                Browse Beats
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              icon={Mic}
              title="Studio Recording"
              description="Premium recording sessions with professional equipment"
              price="$150/hr"
              features={[
                "State-of-the-art equipment",
                "Professional sound engineer",
                "Real-time monitoring",
                "High-quality audio export"
              ]}
              onBook={() => openCheckout("Studio Recording Session", "$150/hr")}
            />
            <ServiceCard
              icon={Headphones}
              title="Mixing & Mastering"
              description="Professional mixing and mastering services"
              price="$200"
              features={[
                "Professional mixing",
                "Radio-ready mastering",
                "Unlimited revisions",
                "Fast turnaround"
              ]}
              onBook={() => openCheckout("Mixing & Mastering", "$200")}
            />
            <ServiceCard
              icon={Music}
              title="Sync Licensing"
              description="License our beats for your projects"
              price="From $50"
              features={[
                "Exclusive & non-exclusive",
                "Commercial use rights",
                "Instant download",
                "Multiple formats"
              ]}
              onBook={() => openCheckout("Beat License", "From $50")}
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Create?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of artists who trust ThaFamilyBeats for their recording needs.
          </p>
          <Link href="/contact">
            <Button size="lg" data-testid="button-get-started">Get Started Today</Button>
          </Link>
        </div>
      </section>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        service={selectedService.name}
        price={selectedService.price}
      />
    </div>
  );
}
