import { useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link } from "wouter";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ImageIcon,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  formatPartnerPrice,
  partnerBookingConfig,
  partnerBookingRequestSchema,
  partnerPackageIds,
  partnerStudios,
  type PartnerBookingRequest,
  type PartnerStudio,
} from "@shared/partnerStudios";

type Confirmation = {
  reservationCode: string;
  depositAmount: number;
  totalAmount: number;
  balanceDue: number;
  studioName: string;
  packageLabel: string;
  requestedDates: string[];
  status: string;
};

const fieldClass = "mt-1.5";

const getDepositAmount = (priceCents: number) => Math.round(priceCents * partnerBookingConfig.depositRate);

const generateReservationCode = () => {
  let value = Math.floor(Math.random() * 1_000_000);
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    value = values[0] % 1_000_000;
  }
  return `TFB-HW-${value.toString().padStart(6, "0")}`;
};

const getMinimumDateTime = () => {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const formatDateTime = (value: string) => new Date(value).toLocaleString("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm font-medium text-destructive">{message}</p>;
}

function StudioGallery({ studio }: { studio: PartnerStudio }) {
  const [activeImage, setActiveImage] = useState(0);
  const imageCount = studio.imageUrls.length;
  const showImage = (offset: number) => {
    setActiveImage((current) => (current + offset + imageCount) % imageCount);
  };

  return (
    <div className="border-b border-border bg-black/70">
      <div className="relative flex min-h-64 aspect-[16/9] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,hsl(var(--primary)/.12),transparent_68%)]">
        {imageCount ? (
          <img
            src={studio.imageUrls[activeImage]}
            alt={`${studio.name} view ${activeImage + 1} of ${imageCount}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <ImageIcon className="mx-auto mb-3 h-10 w-10 text-primary/70" />
            <p className="text-sm">Approved studio photograph pending</p>
          </div>
        )}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {studio.isExample && <Badge variant="secondary">Example Listing</Badge>}
          <Badge className="gap-1 bg-primary text-white"><Clock3 className="h-3 w-3" />Availability confirmation required</Badge>
        </div>

        {imageCount > 1 && (
          <>
            <button type="button" onClick={() => showImage(-1)} aria-label={`Previous ${studio.name} photo`} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/65 p-2 text-white backdrop-blur transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => showImage(1)} aria-label={`Next ${studio.name} photo`} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/65 p-2 text-white backdrop-blur transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 font-mono text-xs text-white">
              {activeImage + 1} / {imageCount}
            </span>
          </>
        )}
      </div>

      {imageCount > 1 && (
        <div className="grid grid-cols-5 gap-2 p-2" aria-label={`${studio.name} photo thumbnails`}>
          {studio.imageUrls.map((imageUrl, index) => (
            <button
              key={imageUrl}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={`Show ${studio.name} photo ${index + 1}`}
              aria-current={activeImage === index ? "true" : undefined}
              className={`aspect-[16/9] overflow-hidden rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeImage === index ? "border-primary opacity-100" : "border-white/10 opacity-55 hover:opacity-100"}`}
            >
              <img src={imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PartnerStudios() {
  const { toast } = useToast();
  const formSectionRef = useRef<HTMLElement>(null);
  const confirmationRef = useRef<HTMLElement>(null);
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const minimumDateTime = useMemo(getMinimumDateTime, []);

  const form = useForm<PartnerBookingRequest>({
    resolver: zodResolver(partnerBookingRequestSchema),
    defaultValues: {
      reservationCode: "",
      legalName: "",
      artistName: "",
      email: "",
      phone: "",
      studioId: "",
      guestCount: 1,
      recordingType: "",
      preferredDaw: "",
      equipmentRequests: "",
      additionalNotes: "",
      paymentSenderName: "",
      paymentReference: "",
      acceptedTerms: false,
    },
  });

  const selectedStudio = partnerStudios.find((studio) => studio.id === selectedStudioId);
  const selectedPackageId = form.watch("packageId");
  const selectedPaymentMethod = form.watch("paymentMethod");
  const selectedPackage = selectedStudio?.packages && selectedPackageId
    ? selectedStudio.packages[selectedPackageId]
    : undefined;

  const selectStudio = (studioId: string) => {
    const reservationCode = generateReservationCode();
    setSelectedStudioId(studioId);
    setConfirmation(null);
    form.reset({
      reservationCode,
      legalName: "",
      artistName: "",
      email: "",
      phone: "",
      studioId,
      guestCount: 1,
      recordingType: "",
      preferredDaw: "",
      equipmentRequests: "",
      additionalNotes: "",
      paymentSenderName: "",
      paymentReference: "",
      acceptedTerms: false,
    });
    window.setTimeout(() => formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const submitRequest = async (values: PartnerBookingRequest) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/partner-bookings", {
        ...values,
        preferredDateTime: new Date(values.preferredDateTime).toISOString(),
        secondChoiceDateTime: new Date(values.secondChoiceDateTime).toISOString(),
        thirdChoiceDateTime: new Date(values.thirdChoiceDateTime).toISOString(),
      });
      const result = await response.json() as Confirmation;
      setConfirmation(result);
      window.setTimeout(() => confirmationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (error: any) {
      toast({
        title: "Request not submitted",
        description: error.message || "Please review the form and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="brand-kicker mb-3">Independent locations · Coordinated by TFB</p>
          <h1 className="text-4xl md:text-6xl font-display font-semibold mb-5">HOLLYWOOD PARTNER STUDIOS</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Record at select professional Hollywood and Los Angeles studios with booking coordination and engineering provided by TFB Studios.
          </p>
        </div>

        <div className="mb-12 flex items-start gap-4 rounded-2xl border border-primary/25 bg-primary/5 p-5 md:p-6">
          <Building2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-display text-xl font-semibold text-white">Partner locations are independently operated</h2>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              These Hollywood locations are separate from TFB Studios' owned Long Beach room. Every request requires manual payment verification and studio availability confirmation.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {partnerStudios.map((studio) => (
            <Card key={studio.id} className="overflow-hidden border-primary/20">
              <StudioGallery studio={studio} />

              <CardHeader>
                <CardTitle className="font-display text-3xl">{studio.name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  {studio.neighborhood} · General area only
                </CardDescription>
                {studio.capacity && (
                  <p className="flex items-center gap-1.5 pt-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    Maximum capacity: {studio.capacity} people
                  </p>
                )}
                <p className="pt-2 text-sm text-muted-foreground leading-relaxed">{studio.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className={`grid gap-5 ${studio.amenities.length ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">Equipment</h3>
                    {studio.equipment.length ? (
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {studio.equipment.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    ) : <p className="text-sm text-muted-foreground">Approved equipment list pending.</p>}
                  </div>
                  {studio.amenities.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">Amenities</h3>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {studio.amenities.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                {studio.packages ? (
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white">Packages</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {partnerPackageIds.map((packageId) => {
                        const packageOption = studio.packages![packageId];
                        if (!packageOption) return null;
                        return (
                          <div key={packageId} className="rounded-xl border border-border bg-black/25 p-4">
                            <p className="text-sm font-medium text-white">{packageOption.label}</p>
                            <p className="mt-2 font-mono text-xl font-semibold text-primary">{formatPartnerPrice(packageOption.priceCents)}</p>
                            <p className="mt-1 text-xs text-muted-foreground">50% deposit: {formatPartnerPrice(getDepositAmount(packageOption.priceCents))}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm font-medium text-white">Package pricing available by inquiry</p>
                    <p className="mt-1 text-sm text-muted-foreground">Tell us about your session and preferred dates. TFB will respond with current options before any payment is requested.</p>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                {studio.bookingMode === "paid_request" && studio.packages ? (
                  <Button className="w-full" size="lg" onClick={() => selectStudio(studio.id)}>
                    Pay Deposit & Request This Studio
                  </Button>
                ) : (
                  <Link href={`/contact?service=recording&studio=${encodeURIComponent(studio.name)}`} className="w-full">
                    <Button className="w-full" size="lg">Inquire About This Studio</Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {selectedStudio && !confirmation && (
          <section ref={formSectionRef} className="scroll-mt-24 mt-16 max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <p className="brand-kicker mb-3">Paid reservation request</p>
              <h2 className="font-display text-3xl md:text-5xl font-semibold">Request {selectedStudio.name}</h2>
            </div>

            <form onSubmit={form.handleSubmit(submitRequest)} className="space-y-8" noValidate>
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-2xl">Reservation Code</CardTitle>
                  <CardDescription>Include this code in the note on your Cash App or Zelle payment.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-primary/30 bg-primary/10 px-5 py-6 text-center">
                    <p className="font-mono text-3xl font-bold tracking-[0.08em] text-primary" data-testid="partner-reservation-code">
                      {form.watch("reservationCode")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-2xl">Contact & Artist Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="legalName">Legal Name</Label>
                    <Input id="legalName" className={fieldClass} {...form.register("legalName")} />
                    <FieldError message={form.formState.errors.legalName?.message} />
                  </div>
                  <div>
                    <Label htmlFor="artistName">Artist Name</Label>
                    <Input id="artistName" className={fieldClass} {...form.register("artistName")} />
                    <FieldError message={form.formState.errors.artistName?.message} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" className={fieldClass} {...form.register("email")} />
                    <FieldError message={form.formState.errors.email?.message} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" className={fieldClass} {...form.register("phone")} />
                    <FieldError message={form.formState.errors.phone?.message} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-2xl">Package & Requested Times</CardTitle>
                  <CardDescription>Choose three future options. This request does not reserve any time until TFB sends final confirmation.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="packageId">Package</Label>
                    <select id="packageId" className="mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" {...form.register("packageId")}>
                      <option value="">Select a package</option>
                      {partnerPackageIds.map((packageId) => {
                        const packageOption = selectedStudio.packages![packageId];
                        if (!packageOption) return null;
                        return <option key={packageId} value={packageId}>{packageOption.label} — {formatPartnerPrice(packageOption.priceCents)}</option>;
                      })}
                    </select>
                    <FieldError message={form.formState.errors.packageId?.message} />
                  </div>
                  <div>
                    <Label htmlFor="preferredDateTime">Preferred Date & Starting Time</Label>
                    <Input id="preferredDateTime" type="datetime-local" min={minimumDateTime} className={fieldClass} {...form.register("preferredDateTime")} />
                    <FieldError message={form.formState.errors.preferredDateTime?.message} />
                  </div>
                  <div>
                    <Label htmlFor="secondChoiceDateTime">Second Choice</Label>
                    <Input id="secondChoiceDateTime" type="datetime-local" min={minimumDateTime} className={fieldClass} {...form.register("secondChoiceDateTime")} />
                    <FieldError message={form.formState.errors.secondChoiceDateTime?.message} />
                  </div>
                  <div>
                    <Label htmlFor="thirdChoiceDateTime">Third Choice</Label>
                    <Input id="thirdChoiceDateTime" type="datetime-local" min={minimumDateTime} className={fieldClass} {...form.register("thirdChoiceDateTime")} />
                    <FieldError message={form.formState.errors.thirdChoiceDateTime?.message} />
                  </div>
                  <div>
                    <Label htmlFor="guestCount">Number of Guests</Label>
                    <Input id="guestCount" type="number" min={1} max={30} className={fieldClass} {...form.register("guestCount", { valueAsNumber: true })} />
                    <FieldError message={form.formState.errors.guestCount?.message} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-2xl">Session Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="recordingType">Type of Recording</Label>
                    <Input id="recordingType" placeholder="Vocals, full band, podcast..." className={fieldClass} {...form.register("recordingType")} />
                    <FieldError message={form.formState.errors.recordingType?.message} />
                  </div>
                  <div>
                    <Label htmlFor="preferredDaw">Preferred DAW</Label>
                    <Input id="preferredDaw" placeholder="Pro Tools, Logic Pro..." className={fieldClass} {...form.register("preferredDaw")} />
                    <FieldError message={form.formState.errors.preferredDaw?.message} />
                  </div>
                  <div>
                    <Label htmlFor="equipmentRequests">Equipment Requests</Label>
                    <Textarea id="equipmentRequests" rows={4} className={fieldClass} placeholder="List microphones, instruments, routing, or monitoring needs." {...form.register("equipmentRequests")} />
                    <FieldError message={form.formState.errors.equipmentRequests?.message} />
                  </div>
                  <div>
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea id="additionalNotes" rows={4} className={fieldClass} placeholder="Share any accessibility, setup, or session details." {...form.register("additionalNotes")} />
                    <FieldError message={form.formState.errors.additionalNotes?.message} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/25">
                <CardHeader>
                  <CardTitle className="font-display text-2xl flex items-center gap-2"><WalletCards className="h-5 w-5 text-primary" />Manual Payment</CardTitle>
                  <CardDescription>Send the 50% deposit before submitting this paid reservation request, then call TFB so we can secure the room.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={`cursor-pointer rounded-xl border p-5 transition-all focus-within:ring-2 focus-within:ring-ring ${selectedPaymentMethod === "cashapp" ? "border-primary bg-primary/10" : "border-border bg-black/25 hover:border-primary/40"}`}>
                      <input type="radio" value="cashapp" className="sr-only" {...form.register("paymentMethod")} />
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Cash App</span>
                      <span className="mt-2 block font-mono text-xl font-semibold text-white">{partnerBookingConfig.cashApp}</span>
                    </label>
                    {partnerBookingConfig.zelle && (
                      <label className={`cursor-pointer rounded-xl border p-5 transition-all focus-within:ring-2 focus-within:ring-ring ${selectedPaymentMethod === "zelle" ? "border-primary bg-primary/10" : "border-border bg-black/25 hover:border-primary/40"}`}>
                        <input type="radio" value="zelle" className="sr-only" {...form.register("paymentMethod")} />
                        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Zelle</span>
                        <span className="mt-2 block break-all font-mono text-sm font-semibold text-white">{partnerBookingConfig.zelle}</span>
                      </label>
                    )}
                  </div>
                  <FieldError message={form.formState.errors.paymentMethod?.message} />

                  {selectedPackage ? (
                    <div className="rounded-xl border border-primary/30 bg-primary/10 p-5 text-center">
                      <p className="text-sm text-muted-foreground">Send this 50% deposit now</p>
                      <p className="my-2 font-mono text-4xl font-bold text-primary">{formatPartnerPrice(getDepositAmount(selectedPackage.priceCents))}</p>
                      <p className="text-sm text-white/75">Package total: {formatPartnerPrice(selectedPackage.priceCents)} · Remaining balance: {formatPartnerPrice(selectedPackage.priceCents - getDepositAmount(selectedPackage.priceCents))}</p>
                      <p className="text-sm text-white">Payment note: <span className="font-mono font-semibold">{form.watch("reservationCode")}</span></p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">Select a package above to see the payment total.</div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="paymentSenderName">Name Payment Was Sent Under</Label>
                      <Input id="paymentSenderName" className={fieldClass} {...form.register("paymentSenderName")} />
                      <FieldError message={form.formState.errors.paymentSenderName?.message} />
                    </div>
                    <div>
                      <Label htmlFor="paymentReference">Transaction / Reference Number</Label>
                      <Input id="paymentReference" className={fieldClass} {...form.register("paymentReference")} />
                      <FieldError message={form.formState.errors.paymentReference?.message} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-400/40 bg-amber-400/5">
                <CardContent className="pt-6 space-y-5">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="h-6 w-6 flex-shrink-0 text-amber-300" />
                    <div>
                      <h3 className="font-display text-xl font-semibold text-white">Important Customer Notice</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        The 50% deposit submits a paid reservation request. After sending it, you must call TFB Studios at {partnerBookingConfig.bookingPhoneDisplay} so we can verify payment and secure the selected location. Your studio is not confirmed until TFB sends final confirmation. If your requested times are unavailable, you may select an alternative room or date or receive a full deposit refund. Once the outside studio has been secured, the disclosed cancellation policy applies. TFB will provide the remaining balance deadline with final confirmation.
                      </p>
                    </div>
                  </div>

                  <Controller
                    control={form.control}
                    name="acceptedTerms"
                    render={({ field }) => (
                      <div>
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-300/25 bg-black/20 p-4">
                          <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} className="mt-0.5" />
                          <span className="text-sm leading-relaxed text-white">I accept the pending-confirmation and cancellation terms stated above.</span>
                        </label>
                        <FieldError message={form.formState.errors.acceptedTerms?.message} />
                      </div>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !selectedPackage}>
                {isSubmitting ? "Submitting Deposit & Booking Request..." : "Submit Deposit & Booking Request"}
              </Button>
            </form>
          </section>
        )}

        {confirmation && (
          <section ref={confirmationRef} className="scroll-mt-24 mt-16 max-w-3xl mx-auto">
            <Card className="overflow-hidden border-primary/35">
              <div className="h-1 bg-primary shadow-[0_0_20px_hsl(var(--primary))]" />
              <CardHeader className="text-center">
                <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" />
                <CardTitle className="font-display text-3xl md:text-4xl">Request Received</CardTitle>
                <CardDescription>TFB Studios will verify your payment and contact the partner location.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl border border-primary/30 bg-primary/10 p-5 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Reservation Code</p>
                  <p className="mt-2 font-mono text-3xl font-bold text-primary">{confirmation.reservationCode}</p>
                </div>
                <dl className="grid gap-5 sm:grid-cols-2">
                  <div><dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Deposit Submitted</dt><dd className="mt-1 font-mono text-xl text-white">{formatPartnerPrice(confirmation.depositAmount)}</dd></div>
                  <div><dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Package Total</dt><dd className="mt-1 font-mono text-xl text-white">{formatPartnerPrice(confirmation.totalAmount)}</dd></div>
                  <div><dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Remaining Balance</dt><dd className="mt-1 font-mono text-xl text-white">{formatPartnerPrice(confirmation.balanceDue)}</dd></div>
                  <div><dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Selected Package</dt><dd className="mt-1 text-white">{confirmation.packageLabel}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Requested Dates</dt><dd className="mt-2 space-y-1 text-white">{confirmation.requestedDates.map((date) => <p key={date}>{formatDateTime(date)}</p>)}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Status</dt><dd className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-sm text-amber-200"><ShieldCheck className="h-4 w-4" />{confirmation.status}</dd></div>
                </dl>
                <div className="rounded-xl border border-primary/35 bg-primary/10 p-5 text-center">
                  <p className="font-display text-xl font-semibold text-white">Call TFB now to secure the room</p>
                  <p className="mt-2 text-sm text-white/75">Have your reservation code and payment reference ready.</p>
                  <a href={partnerBookingConfig.bookingPhoneHref} className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                    <PhoneCall className="h-5 w-5" />
                    Call {partnerBookingConfig.bookingPhoneDisplay}
                  </a>
                </div>
                <p className="rounded-xl border border-border bg-black/25 p-5 text-sm leading-relaxed text-muted-foreground">
                  TFB will provide final availability, the remaining balance deadline, and location details after the call. No partner studio address is released until the deposit is verified and the room is secured.
                </p>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
