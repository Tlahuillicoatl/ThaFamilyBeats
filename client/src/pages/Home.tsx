import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Mic, Music, Headphones, ChevronRight } from "lucide-react";
import logoPath from "@assets/TransparentTFB_1761962201894.png";
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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <img src={logoPath} alt="ThaFamilyBeats" className="w-64 md:w-96 mx-auto mb-12" />
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
              price="$75/hr"
              features={[
                "State-of-the-art equipment",
                "Professional sound engineer",
                "Real-time monitoring",
                "High-quality audio export"
              ]}
              onBook={() => openCheckout("Studio Recording Session", "$75/hr")}
            />
            <ServiceCard
              icon={Headphones}
              title="Mixing Services"
              description="Professional mixing services"
              price="$350"
              features={[
                "Professional mixing",
                "Unlimited revisions",
                "Fast turnaround",
                "High-quality stereo mix"
              ]}
              onBook={() => openCheckout("Mixing Service", "$350")}
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
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">Featured Work</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Check out some of our recent mixes and productions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video 1 */}
            <div className="aspect-video bg-background rounded-md overflow-hidden border border-border">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/rE9s-SeNrFg"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-testid="video-1"
              ></iframe>
            </div>
            {/* Video 2 */}
            <div className="aspect-video bg-background rounded-md overflow-hidden border border-border">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/2muNDKXH1EY"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-testid="video-2"
              ></iframe>
            </div>
            {/* Video 3 */}
            <div className="aspect-video bg-background rounded-md overflow-hidden border border-border">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/Lpu50TEFltM"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-testid="video-3"
              ></iframe>
            </div>
            {/* Video 4 */}
            <div className="aspect-video bg-background rounded-md overflow-hidden border border-border">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/VadgJv6oync"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-testid="video-4"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">Credits</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Trusted by industry legends and rising stars
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-md bg-card border border-card-border hover-elevate transition-all">
              <h3 className="font-display font-semibold text-lg">Lil Xan</h3>
              <p className="text-sm text-muted-foreground mt-1">Artist</p>
            </div>
            <div className="text-center p-6 rounded-md bg-card border border-card-border hover-elevate transition-all">
              <h3 className="font-display font-semibold text-lg">Death Row Records</h3>
              <p className="text-sm text-muted-foreground mt-1">Label</p>
            </div>
            <div className="text-center p-6 rounded-md bg-card border border-card-border hover-elevate transition-all">
              <h3 className="font-display font-semibold text-lg">Cash Money Records</h3>
              <p className="text-sm text-muted-foreground mt-1">Label</p>
            </div>
            <div className="text-center p-6 rounded-md bg-card border border-card-border hover-elevate transition-all">
              <h3 className="font-display font-semibold text-lg">Thizz Nation</h3>
              <p className="text-sm text-muted-foreground mt-1">Label</p>
            </div>
            <div className="text-center p-6 rounded-md bg-card border border-card-border hover-elevate transition-all">
              <h3 className="font-display font-semibold text-lg">Mistah F.A.B.</h3>
              <p className="text-sm text-muted-foreground mt-1">Artist</p>
            </div>
            <div className="text-center p-6 rounded-md bg-card border border-card-border hover-elevate transition-all">
              <h3 className="font-display font-semibold text-lg">Keyshia Cole</h3>
              <p className="text-sm text-muted-foreground mt-1">Artist</p>
            </div>
            <div className="text-center p-6 rounded-md bg-card border border-card-border hover-elevate transition-all">
              <h3 className="font-display font-semibold text-lg">Eric Bellinger</h3>
              <p className="text-sm text-muted-foreground mt-1">Artist</p>
            </div>
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
