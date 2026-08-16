import { Link } from "wouter";
import { ArrowRight, AudioLines, Headphones, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MixReferencePlayer from "@/components/MixReferencePlayer";

type MixReference = {
  title: string;
  artist: string;
  genre: string;
  beforeSrc: string;
  afterSrc: string;
};

const mixReferences: MixReference[] = [
  {
    title: "Broken Pieces",
    artist: "Amen Okon",
    genre: "Mixed & mastered by J11",
    beforeSrc: "/audio/mix-references/broken-pieces-before.mp3",
    afterSrc: "/audio/mix-references/broken-pieces-after.mp3",
  },
  {
    title: "N The Club",
    artist: "Amen Okon",
    genre: "Mixed & mastered by J11",
    beforeSrc: "/audio/mix-references/n-the-club-before.mp3",
    afterSrc: "/audio/mix-references/n-the-club-after.mp3",
  },
  {
    title: "Tyron",
    artist: "Amen Okon",
    genre: "Mixed & mastered by J11",
    beforeSrc: "/audio/mix-references/tyron-before.mp3",
    afterSrc: "/audio/mix-references/tyron-after.mp3",
  },
  {
    title: "Ready",
    artist: "Amen Okon",
    genre: "Mixed & mastered by J11",
    beforeSrc: "/audio/mix-references/ready-before.mp3",
    afterSrc: "/audio/mix-references/ready-after.mp3",
  },
  {
    title: "Let's Ride",
    artist: "Amen Okon",
    genre: "Mixed & mastered by J11",
    beforeSrc: "/audio/mix-references/lets-ride-before.mp3",
    afterSrc: "/audio/mix-references/lets-ride-after.mp3",
  },
];

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

        <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 text-center text-sm text-muted-foreground">
          Press play, then switch between <span className="font-semibold text-white">Before</span> and <span className="font-semibold text-primary">After</span> at any point to hear the mix transformation.
        </div>

        <div className="space-y-8 mb-16">
          {mixReferences.map((reference) => (
            <Card key={`${reference.artist}-${reference.title}`} className="overflow-hidden">
              <CardHeader className="border-b border-border/70">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <CardTitle className="font-display text-3xl">{reference.title}</CardTitle>
                    <CardDescription className="mt-1">{reference.artist}</CardDescription>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-primary">{reference.genre}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <MixReferencePlayer
                  id={`${reference.artist}-${reference.title}`}
                  beforeSrc={reference.beforeSrc}
                  afterSrc={reference.afterSrc}
                />
              </CardContent>
            </Card>
          ))}
        </div>

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
