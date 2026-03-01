import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import CheckoutModal from "@/components/CheckoutModal";
import { useQuery } from "@tanstack/react-query";

type Beat = {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  price: number;
  audioPath: string;
  createdAt: string;
};

export default function SyncLicensing() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedBeat, setSelectedBeat] = useState({ name: "", price: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const { data: beats, isLoading } = useQuery<Beat[]>({
    queryKey: ["/api/beats"],
  });

  const filteredBeats = beats?.filter((beat) => {
    const query = searchQuery.toLowerCase();
    return (
      beat.title.toLowerCase().includes(query) ||
      beat.genre.toLowerCase().includes(query) ||
      beat.bpm.toString().includes(query)
    );
  }) || [];

  const handleLicense = (beat: { title: string; price: number }) => {
    setSelectedBeat({ 
      name: `Beat License - ${beat.title}`, 
      price: `$${(beat.price / 100).toFixed(0)}` 
    });
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-beats"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filteredBeats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBeats.map((beat) => (
            <Card key={beat.id} className="hover-elevate transition-all">
              <CardHeader>
                <CardTitle className="font-display">{beat.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <audio 
                  controls 
                  className="w-full"
                  data-testid={`audio-player-${beat.id}`}
                >
                  <source src={beat.audioPath} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{beat.genre}</span>
                  <span>•</span>
                  <span>{beat.bpm} BPM</span>
                </div>
                <div className="text-2xl font-mono font-bold">
                  ${(beat.price / 100).toFixed(0)}
                </div>
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
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "No beats found matching your search." : "No beats available yet. Check back soon!"}
            </p>
          </div>
        )}

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
        serviceType="licensing"
      />
    </div>
  );
}
