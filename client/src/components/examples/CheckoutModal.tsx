import CheckoutModal from '../CheckoutModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CheckoutModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8 flex items-center justify-center min-h-screen bg-background">
      <Button onClick={() => setIsOpen(true)}>Open Checkout Modal</Button>
      <CheckoutModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        service="Studio Session - 2 Hours"
        price="$150"
      />
    </div>
  );
}
