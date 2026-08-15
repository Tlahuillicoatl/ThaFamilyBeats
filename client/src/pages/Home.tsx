import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Mic, Music, Headphones, ChevronRight } from "lucide-react";
import logoPath from "@assets/tfb-studios-header.png";
import studioVideo from "@assets/P1110181_1763402579250.mp4";
import ServiceCard from "@/components/ServiceCard";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen">
      <section className="brand-hero relative min-h-[92vh] flex items-center justify-center overflow-hidden py-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="video-hero-background"
        >
          <source src={studioVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.72)_0%,rgba(1,5,16,.76)_52%,hsl(var(--background))_100%)]" />
        <div className="brand-hero-orb absolute -right-40 top-16 h-[34rem] w-[34rem] rounded-full" />
        <div className="brand-hero-line absolute left-[-12%] top-[44%] h-px w-[70%] -rotate-12" />
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 pt-8">
          <p className="brand-kicker brand-reveal mb-5">Long Beach · Recording · Mixing · Licensing</p>
          <img src={logoPath} alt="ThaFamily Beats Studios" className="brand-wordmark brand-reveal w-[min(94vw,880px)] h-auto mx-auto mb-6" />
          <h1 className="brand-reveal text-4xl md:text-6xl lg:text-7xl font-display font-semibold mb-6 text-white leading-[0.95] tracking-[-0.025em]">
            Where Sound Meets <span className="text-primary italic">Excellence</span>
          </h1>
          <p className="brand-reveal text-base md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
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
              <Button size="lg" variant="outline" className="gap-2 backdrop-blur-sm bg-black/30 border-primary/50 text-white hover:border-primary" data-testid="button-browse-beats">
                Browse Beats
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="brand-section py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="brand-kicker text-center mb-3">Built for artists</p>
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-center mb-14">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              icon={Mic}
              title="Studio Recording"
              description="Premium recording sessions with professional equipment"
              price="Book online"
              features={[
                "State-of-the-art equipment",
                "Professional sound engineer",
                "Real-time monitoring",
                "High-quality audio export"
              ]}
              onBook={() => setLocation("/studio-booking")}
              actionLabel="View Booking"
            />
            <ServiceCard
              icon={Headphones}
              title="Mixing Services"
              description="Professional mixing services"
              price="View packages"
              features={[
                "Professional mixing",
                "Unlimited revisions",
                "Fast turnaround",
                "High-quality stereo mix"
              ]}
              onBook={() => setLocation("/studio-booking")}
              actionLabel="View Booking"
            />
            <ServiceCard
              icon={Music}
              title="Sync Licensing"
              description="License our beats for your projects"
              features={[
                "Exclusive & non-exclusive",
                "Project-specific terms",
                "Direct licensing support",
                "Multiple delivery formats"
              ]}
              onBook={() => setLocation("/contact?service=licensing")}
              actionLabel="Contact Us"
            />
          </div>
        </div>
      </section>

      <section className="brand-panel py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="brand-kicker text-center mb-3">Selected releases</p>
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-center mb-4">Featured Work</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Check out some of our recent mixes and productions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video 1 */}
            <div className="brand-media aspect-video bg-background rounded-xl overflow-hidden border">
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
            <div className="brand-media aspect-video bg-background rounded-xl overflow-hidden border">
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
            <div className="brand-media aspect-video bg-background rounded-xl overflow-hidden border">
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
            <div className="brand-media aspect-video bg-background rounded-xl overflow-hidden border">
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

      <section className="brand-section py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="brand-kicker text-center mb-3">Trusted collaborators</p>
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-center mb-4">Credits</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Trusted by industry legends and rising stars
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="brand-credit text-center p-6 rounded-xl bg-card border transition-all">
              <h3 className="font-display font-semibold text-lg">Lil Xan</h3>
              <p className="text-sm text-muted-foreground mt-1">Artist</p>
            </div>
            <div className="brand-credit text-center p-6 rounded-xl bg-card border transition-all">
              <h3 className="font-display font-semibold text-lg">Death Row Records</h3>
              <p className="text-sm text-muted-foreground mt-1">Label</p>
            </div>
            <div className="brand-credit text-center p-6 rounded-xl bg-card border transition-all">
              <h3 className="font-display font-semibold text-lg">Cash Money Records</h3>
              <p className="text-sm text-muted-foreground mt-1">Label</p>
            </div>
            <div className="brand-credit text-center p-6 rounded-xl bg-card border transition-all">
              <h3 className="font-display font-semibold text-lg">Thizz Nation</h3>
              <p className="text-sm text-muted-foreground mt-1">Label</p>
            </div>
            <div className="brand-credit text-center p-6 rounded-xl bg-card border transition-all">
              <h3 className="font-display font-semibold text-lg">Mistah F.A.B.</h3>
              <p className="text-sm text-muted-foreground mt-1">Artist</p>
            </div>
            <div className="brand-credit text-center p-6 rounded-xl bg-card border transition-all">
              <h3 className="font-display font-semibold text-lg">Keyshia Cole</h3>
              <p className="text-sm text-muted-foreground mt-1">Artist</p>
            </div>
            <div className="brand-credit text-center p-6 rounded-xl bg-card border transition-all">
              <h3 className="font-display font-semibold text-lg">Eric Bellinger</h3>
              <p className="text-sm text-muted-foreground mt-1">Artist</p>
            </div>
          </div>
        </div>
      </section>

      <section className="brand-cta py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="brand-kicker mb-3">Your next record starts here</p>
          <h2 className="text-4xl md:text-6xl font-display font-semibold mb-6">Ready to Create?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of artists who trust ThaFamilyBeats for their recording needs.
          </p>
          <Link href="/contact">
            <Button size="lg" data-testid="button-get-started">Get Started Today</Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
