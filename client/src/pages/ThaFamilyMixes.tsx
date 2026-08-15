import { Link } from "wouter";
import { ArrowRight, AudioLines, Headphones, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type MixReference = {
  title: string;
  artist: string;
  genre: string;
  beforeSrc: string;
  afterSrc: string;
};

// Add paired audio files here as new mix references become available.
const mixReferences: MixReference[] = [];

export default function ThaFamilyMixes() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="brand-kicker mb-3">Hear the difference</p>
          <h1 className="text-4xl md:text-6xl font-display font-semibold mb-5">Mix References</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Compare raw or rough recordings with the final ThaFamilyBeats mix. Use headphones for the clearest before-and-after experience.
          </p>
        </div>

        {mixReferences.length > 0 ? (
          <div className="space-y-8 mb-16">
            {mixReferences.map((reference) => (
              <Card key={`${reference.artist}-${reference.title}`} className="overflow-hidden">
                <CardHeader className="border-b border-border/70">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <CardTitle className="font-display text-2xl">{reference.title}</CardTitle>
                      <CardDescription>{reference.artist}</CardDescription>
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-primary">{reference.genre}</span>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-black/30 p-5">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Before</p>
                    <audio controls preload="metadata" className="w-full" src={reference.beforeSrc}>
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">After</p>
                    <audio controls preload="metadata" className="w-full" src={reference.afterSrc}>
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="brand-panel mb-16 overflow-hidden border-primary/20">
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                <AudioLines className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-3 font-display text-3xl font-semibold">Before-and-after audio is coming soon</h2>
              <p className="max-w-xl text-muted-foreground leading-relaxed">
                We are preparing matched examples so you can hear exactly how our engineers improve balance, clarity, depth, and impact.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 mb-16 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Headphones className="h-6 w-6 text-primary mb-3" />
              <CardTitle className="font-display text-xl">Balance & Clarity</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Listen for clearer vocals, defined instruments, and a mix where every element has its own space.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <AudioLines className="h-6 w-6 text-primary mb-3" />
              <CardTitle className="font-display text-xl">Depth & Movement</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Notice the wider stereo image, intentional dynamics, and front-to-back dimension of the final mix.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Sparkles className="h-6 w-6 text-primary mb-3" />
              <CardTitle className="font-display text-xl">Release-Ready Finish</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Compare the energy, consistency, and translation prepared for headphones, speakers, and streaming platforms.
            </CardContent>
          </Card>
        </div>

        <section className="brand-cta rounded-2xl border border-primary/25 px-6 py-12 text-center md:px-12">
          <p className="brand-kicker mb-3">Ready for your sound?</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">Book your mix with ThaFamilyBeats</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Mixing services and availability are handled through our booking page.
          </p>
          <Link href="/studio-booking">
            <Button size="lg" className="gap-2">
              View Mixing Services
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
