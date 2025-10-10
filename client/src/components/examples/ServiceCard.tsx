import ServiceCard from '../ServiceCard';
import { Mic } from 'lucide-react';

export default function ServiceCardExample() {
  return (
    <div className="p-8 bg-background">
      <ServiceCard
        icon={Mic}
        title="Studio Session"
        description="Professional recording in our state-of-the-art studio"
        price="$150/hr"
        features={[
          "Professional recording equipment",
          "Experienced sound engineer",
          "Real-time monitoring",
          "High-quality audio export"
        ]}
        onBook={() => console.log('Book clicked')}
      />
    </div>
  );
}
