import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Building2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const bookingUrl = "https://go.flobooking.com/booking/tfbstudios/st/nnoxbOprhiGZCvu30okB?heightMode=fixed&showHeader=true";

export default function StudioBooking() {
  useEffect(() => {
    const scriptId = "flobooking-embed-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://go.flobooking.com/js/form_embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="brand-kicker mb-3">Owned Long Beach location</p>
          <h1 className="text-4xl md:text-6xl font-display font-semibold mb-5">Book Your Session</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose your studio or mixing service, select an available time, and complete your booking securely through FloBooking.
          </p>
        </div>

        <div className="brand-panel overflow-hidden rounded-2xl border border-primary/20 bg-black/30 shadow-[0_24px_80px_rgba(0,0,0,.45)]">
          <iframe
            src={bookingUrl}
            allow="payment"
            className="block w-full border-0 bg-white"
            style={{ minHeight: "980px", overflow: "hidden" }}
            scrolling="no"
            id="nnoxbOprhiGZCvu30okB_1786836028782"
            title="Book TFB Studios through FloBooking"
            data-testid="flobooking-embed"
          />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Having trouble with the booking form?{" "}
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
          >
            Open FloBooking directly
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </p>

        <section className="brand-cta mt-16 rounded-2xl border border-primary/25 px-6 py-10 text-center md:px-12">
          <Building2 className="mx-auto mb-4 h-9 w-9 text-primary" />
          <p className="brand-kicker mb-3">Need a Hollywood location?</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">Explore Partner Studios</h2>
          <p className="mx-auto mb-7 max-w-2xl text-muted-foreground leading-relaxed">
            Request independently operated Hollywood rooms coordinated by TFB, with room-only and TFB-engineer package options.
          </p>
          <Link href="/partner-studios">
            <Button size="lg" className="gap-2">
              View Hollywood Partner Studios
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
