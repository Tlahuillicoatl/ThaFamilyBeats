import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Music, Users } from "lucide-react";

export default function About() {
  const stats = [
    { icon: Music, value: "500+", label: "Tracks Produced" },
    { icon: Users, value: "200+", label: "Happy Clients" },
    { icon: Award, value: "30+", label: "Years Experience" },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">About ThaFamilyBeats</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner in creating exceptional music since day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-display text-4xl font-bold" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-muted-foreground">
                ThaFamilyBeats was born from a passion for music and a commitment to helping artists realize their creative vision. 
                What started as a small home studio has grown into a professional recording facility equipped with industry-leading 
                technology and staffed by experienced audio engineers.
              </p>
              <p className="text-muted-foreground mt-4">
                Our team brings together decades of combined experience in music production, mixing, and mastering. We've worked 
                with artists across all genres, from hip-hop and R&B to pop and rock, helping them create tracks that stand out 
                in today's competitive music landscape.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We believe every artist deserves access to professional-quality recording services. Our mission is to provide 
                a welcoming, creative environment where musicians can bring their ideas to life with the support of experienced 
                professionals and state-of-the-art equipment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl">Meet The Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">J11</h3>
                  <p className="text-sm text-muted-foreground mb-3">Lead Engineer & Producer</p>
                </div>
                <p className="text-muted-foreground">
                  With over 30 years in the music industry, J11 is a seasoned engineer and producer from Los Angeles 
                  who has seen and shaped the evolution of modern music production. His three decades of experience 
                  bring invaluable wisdom and technical expertise to every project at ThaFamilyBeats. Having worked 
                  through multiple eras of recording technology and music trends, J11 brings a deep understanding of 
                  what makes great music timeless. His mentorship and industry knowledge provide the foundation that 
                  makes ThaFamilyBeats a trusted name in the LA music scene.
                </p>
              </div>

              <div className="border-t border-border pt-8 space-y-4">
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">Angelo Knight</h3>
                  <p className="text-sm text-muted-foreground mb-3">Producer, Engineer & Artist</p>
                </div>
                <p className="text-muted-foreground">
                  Angelo Knight represents the fresh, innovative energy of ThaFamilyBeats. As a multi-talented producer, 
                  engineer, and artist, Angelo brings a unique perspective shaped by both his creative artistry and 
                  technical education at LA Film School's audio program. His youth and hunger drive him to stay on the 
                  cutting edge of production techniques and sonic trends. Angelo's dual role as both creator and technician 
                  allows him to connect with artists on a deeper level, understanding their vision from the inside out. 
                  His passion for perfection and modern approach to music production ensures that ThaFamilyBeats stays 
                  ahead of the curve.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl">Our Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-chart-3 mr-2">✓</span>
                  Neumann U87 & TLM 103 microphones
                </li>
                <li className="flex items-start">
                  <span className="text-chart-3 mr-2">✓</span>
                  SSL & Universal Audio preamps and interfaces
                </li>
                <li className="flex items-start">
                  <span className="text-chart-3 mr-2">✓</span>
                  Pro Tools HD & Logic Pro X workstations
                </li>
                <li className="flex items-start">
                  <span className="text-chart-3 mr-2">✓</span>
                  Genelec & Yamaha monitoring systems
                </li>
                <li className="flex items-start">
                  <span className="text-chart-3 mr-2">✓</span>
                  Extensive plugin suite including UAD, Waves, and FabFilter
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
