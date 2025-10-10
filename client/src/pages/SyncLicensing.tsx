import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Search } from "lucide-react";
import { useState } from "react";
import CheckoutModal from "@/components/CheckoutModal";

export default function SyncLicensing() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedBeat, setSelectedBeat] = useState({ name: "", price: "" });

  const beats = [
    { id: 1, title: "Night Vibes", genre: "Hip Hop", bpm: 140, price: "$50" },
    { id: 2, title: "Sunset Dreams", genre: "R&B", bpm: 85, price: "$75" },
    { id: 3, title: "City Lights", genre: "Trap", bpm: 145, price: "$60" },
    { id: 4, title: "Paradise", genre: "Afrobeat", bpm: 120, price: "$70" },
    { id: 5, title: "Dark Matter", genre: "Drill", bpm: 150, price: "$80" },
    { id: 6, title: "Golden Hour", genre: "Pop", bpm: 95, price: "$65" },
  ];

  const handleLicense = (beat: { title: string; price: string }) => {
    setSelectedBeat({ name: `Beat License - ${beat.title}`, price: beat.price });
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Sync Licensing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our catalog of premium beats and license the perfect sound for your project.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search beats by title, genre, or BPM..."
              className="pl-10"
              data-testid="input-search-beats"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beats.map((beat) => (
            <Card key={beat.id} className="hover-elevate transition-all">
              <CardHeader>
                <CardTitle className="font-display flex items-center justify-between">
                  {beat.title}
                  <Button size="icon" variant="ghost" className="rounded-full" data-testid={`button-play-${beat.id}`}>
                    <Play className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                  <span>{beat.genre}</span>
                  <span>•</span>
                  <span>{beat.bpm} BPM</span>
                </div>
                <div className="text-2xl font-mono font-bold">{beat.price}</div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleLicense(beat)}
                  className="w-full"
                  data-testid={`button-license-${beat.id}`}
                >
                  License Beat
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl">Licensing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-display font-semibold mb-2">Non-Exclusive License</h3>
                <p className="text-muted-foreground text-sm">
                  Perfect for independent artists. Use the beat for commercial releases with standard distribution rights.
                </p>
              </div>
              <div>
                <h3 className="font-display font-semibold mb-2">Exclusive License</h3>
                <p className="text-muted-foreground text-sm">
                  Full ownership and exclusive rights. The beat is removed from our catalog and is yours alone.
                </p>
              </div>
              <div>
                <h3 className="font-display font-semibold mb-2">What's Included</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-chart-3 mr-2">✓</span>
                    High-quality WAV & MP3 files
                  </li>
                  <li className="flex items-start">
                    <span className="text-chart-3 mr-2">✓</span>
                    Trackout stems (exclusive license)
                  </li>
                  <li className="flex items-start">
                    <span className="text-chart-3 mr-2">✓</span>
                    Commercial use rights
                  </li>
                  <li className="flex items-start">
                    <span className="text-chart-3 mr-2">✓</span>
                    Instant download
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        service={selectedBeat.name}
        price={selectedBeat.price}
      />
    </div>
  );
}
