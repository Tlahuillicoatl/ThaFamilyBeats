import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Copy, CheckCircle } from "lucide-react";
import { SiBitcoin, SiPaypal } from "react-icons/si";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: string;
  price: string;
}

export default function CheckoutModal({ isOpen, onClose, service, price }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [copied, setCopied] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const paymentInfo = {
    cashapp: "$811onthebeat",
    zelle: "tfb@thafamilybeats.com",
    crypto: "Your Bitcoin Wallet Address",
    paypal: "tfb@thafamilybeats.com"
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const priceNumber = parseFloat(price.replace(/[^0-9.]/g, ''));
      const amountInCents = Math.round(priceNumber * 100);

      await apiRequest("POST", "/api/transactions", {
        customerName,
        customerEmail,
        service,
        amount: amountInCents,
        paymentMethod: paymentMethod as "card" | "paypal" | "cashapp" | "zelle" | "crypto",
        status: "pending",
      });

      if (paymentMethod === "card") {
        toast({
          title: "Payment Submitted",
          description: "Your booking is being processed.",
        });
      } else {
        toast({
          title: "Payment Instructions Sent",
          description: "Please complete the payment and we'll confirm your booking shortly.",
        });
      }

      setCustomerName("");
      setCustomerEmail("");
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Complete Your Booking</DialogTitle>
          <DialogDescription>
            {service} - <span className="font-mono font-semibold">{price}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <Label className="text-sm uppercase tracking-wide text-muted-foreground mb-3 block">Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === "card" ? "default" : "outline"}
                onClick={() => setPaymentMethod("card")}
                className="flex items-center gap-2"
                data-testid="button-payment-card"
              >
                <CreditCard className="h-4 w-4" />
                Card
              </Button>
              <Button
                variant={paymentMethod === "paypal" ? "default" : "outline"}
                onClick={() => setPaymentMethod("paypal")}
                className="flex items-center gap-2"
                data-testid="button-payment-paypal"
              >
                <SiPaypal className="h-4 w-4" />
                PayPal
              </Button>
              <Button
                variant={paymentMethod === "cashapp" ? "default" : "outline"}
                onClick={() => setPaymentMethod("cashapp")}
                className="flex items-center gap-2"
                data-testid="button-payment-cashapp"
              >
                <Wallet className="h-4 w-4" />
                Cash App
              </Button>
              <Button
                variant={paymentMethod === "zelle" ? "default" : "outline"}
                onClick={() => setPaymentMethod("zelle")}
                className="flex items-center gap-2"
                data-testid="button-payment-zelle"
              >
                <Wallet className="h-4 w-4" />
                Zelle
              </Button>
              <Button
                variant={paymentMethod === "crypto" ? "default" : "outline"}
                onClick={() => setPaymentMethod("crypto")}
                className="flex items-center gap-2"
                data-testid="button-payment-crypto"
              >
                <SiBitcoin className="h-4 w-4" />
                Bitcoin
              </Button>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                className="mt-1.5" 
                data-testid="input-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                className="mt-1.5" 
                data-testid="input-email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>

            {paymentMethod === "card" && (
              <>
                <div>
                  <Label htmlFor="card">Card Number</Label>
                  <Input id="card" placeholder="4242 4242 4242 4242" className="mt-1.5" data-testid="input-card" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" className="mt-1.5" data-testid="input-expiry" />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" className="mt-1.5" data-testid="input-cvc" />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === "cashapp" && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <p className="text-sm text-muted-foreground">Send payment to:</p>
                <div className="flex items-center justify-between bg-background p-3 rounded border">
                  <span className="font-mono text-lg font-semibold">{paymentInfo.cashapp}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(paymentInfo.cashapp, "CashApp")}
                    data-testid="button-copy-cashapp"
                  >
                    {copied === "CashApp" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">After sending, we'll confirm your booking via email.</p>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <p className="text-sm text-muted-foreground">Send payment to:</p>
                <div className="flex items-center justify-between bg-background p-3 rounded border">
                  <span className="font-mono">{paymentInfo.paypal}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(paymentInfo.paypal, "PayPal")}
                    data-testid="button-copy-paypal"
                  >
                    {copied === "PayPal" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">After sending, we'll confirm your booking via email.</p>
              </div>
            )}

            {paymentMethod === "zelle" && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <p className="text-sm text-muted-foreground">Send payment via Zelle to:</p>
                <div className="flex items-center justify-between bg-background p-3 rounded border">
                  <span className="font-mono">{paymentInfo.zelle}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(paymentInfo.zelle, "Zelle")}
                    data-testid="button-copy-zelle"
                  >
                    {copied === "Zelle" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">After sending, we'll confirm your booking via email.</p>
              </div>
            )}

            {paymentMethod === "crypto" && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <p className="text-sm text-muted-foreground">Send Bitcoin to:</p>
                <div className="flex items-center justify-between bg-background p-3 rounded border">
                  <span className="font-mono text-xs break-all">{paymentInfo.crypto}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(paymentInfo.crypto, "Bitcoin Address")}
                    data-testid="button-copy-crypto"
                  >
                    {copied === "Bitcoin Address" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">After sending, we'll confirm your booking via email.</p>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" data-testid="button-complete-payment" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Complete Payment"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
