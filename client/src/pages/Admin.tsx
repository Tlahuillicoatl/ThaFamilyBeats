import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LogOut, Download, Upload, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Transaction = {
  id: string;
  customerName: string;
  customerEmail: string;
  service: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

type Beat = {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  price: number;
  audioPath: string;
  createdAt: string;
};

const beatFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  genre: z.string().min(1, "Genre is required"),
  bpm: z.coerce.number().min(1, "BPM must be at least 1"),
  price: z.coerce.number().min(1, "Price must be at least $1"),
});

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadedAudioURL, setUploadedAudioURL] = useState<string>("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: isAdmin,
  });

  const { data: beats, isLoading: beatsLoading } = useQuery<Beat[]>({
    queryKey: ["/api/beats"],
    enabled: isAdmin,
  });

  const form = useForm<z.infer<typeof beatFormSchema>>({
    resolver: zodResolver(beatFormSchema),
    defaultValues: {
      title: "",
      genre: "",
      bpm: 120,
      price: 50,
    },
  });

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch("/api/admin/check");
      const data = await response.json();
      
      if (!data.isAdmin) {
        setLocation("/admin/login");
      } else {
        setIsAdmin(true);
      }
    } catch (error) {
      setLocation("/admin/login");
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout", {});
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
      setLocation("/admin/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    if (!transactions || transactions.length === 0) {
      toast({
        title: "No Data",
        description: "No transactions to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Date", "Customer Name", "Email", "Service", "Amount", "Payment Method", "Status"];
    const rows = transactions.map(t => [
      format(new Date(t.createdAt), "yyyy-MM-dd HH:mm:ss"),
      t.customerName,
      t.customerEmail,
      t.service,
      `$${(t.amount / 100).toFixed(2)}`,
      t.paymentMethod,
      t.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Transactions exported to CSV",
    });
  };

  const [objectPathMap, setObjectPathMap] = useState<Record<string, string>>({});

  const handleGetUploadParameters = async () => {
    const response = await fetch("/api/objects/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    
    // Store the mapping from uploadURL to objectPath
    setObjectPathMap(prev => ({
      ...prev,
      [data.uploadURL]: data.objectPath
    }));
    
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const uploadURL = uploadedFile.uploadURL || "";
      
      // Use the objectPath from our mapping
      const objectPath = objectPathMap[uploadURL] || uploadURL;
      setUploadedAudioURL(objectPath);
      
      toast({
        title: "Upload Successful",
        description: "Audio file uploaded. Now add beat details.",
      });
    }
  };

  const onSubmitBeat = async (values: z.infer<typeof beatFormSchema>) => {
    if (!uploadedAudioURL) {
      toast({
        title: "Error",
        description: "Please upload an audio file first",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/beats", {
        ...values,
        audioPath: uploadedAudioURL,
        price: values.price * 100,
      });

      await queryClient.invalidateQueries({ queryKey: ["/api/beats"] });

      toast({
        title: "Beat Added",
        description: "Beat has been added to Sync Licensing",
      });

      form.reset();
      setUploadedAudioURL("");
      setUploadDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add beat",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBeat = async (id: string) => {
    if (!confirm("Are you sure you want to delete this beat?")) {
      return;
    }

    try {
      await apiRequest("DELETE", `/api/beats/${id}`, {});
      await queryClient.invalidateQueries({ queryKey: ["/api/beats"] });

      toast({
        title: "Beat Deleted",
        description: "Beat has been removed from Sync Licensing",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete beat",
        variant: "destructive",
      });
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const totalRevenue = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
  const pendingCount = transactions?.filter(t => t.status === "pending").length || 0;
  const completedCount = transactions?.filter(t => t.status === "completed").length || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" data-testid="button-logout">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-3xl font-mono">
                ${(totalRevenue / 100).toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardDescription>Pending Payments</CardDescription>
              <CardTitle className="text-3xl">{pendingCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl">{completedCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>Complete payment history for tax records</CardDescription>
              </div>
              <Button onClick={exportToCSV} variant="outline" data-testid="button-export-csv">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : transactions && transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id} data-testid={`row-transaction-${transaction.id}`}>
                      <TableCell className="font-mono text-sm">
                        {format(new Date(transaction.createdAt), "MMM dd, yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.customerName}</div>
                          <div className="text-sm text-muted-foreground">{transaction.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.service}</TableCell>
                      <TableCell className="font-mono font-semibold">
                        ${(transaction.amount / 100).toFixed(2)}
                      </TableCell>
                      <TableCell className="capitalize">{transaction.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.status === "completed" ? "default" : "secondary"}
                          data-testid={`badge-status-${transaction.id}`}
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sync Licensing Beats</CardTitle>
                <CardDescription>Manage audio files for the Sync Licensing page</CardDescription>
              </div>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-beat">
                    <Upload className="h-4 w-4 mr-2" />
                    Add Beat
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload New Beat</DialogTitle>
                    <DialogDescription>
                      Upload an audio file and add beat details
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Audio File</Label>
                      <div className="mt-2">
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={52428800}
                          onGetUploadParameters={handleGetUploadParameters}
                          onComplete={handleUploadComplete}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadedAudioURL ? "Change File" : "Upload Audio"}
                        </ObjectUploader>
                      </div>
                      {uploadedAudioURL && (
                        <p className="text-sm text-muted-foreground mt-2">
                          ✓ File uploaded successfully
                        </p>
                      )}
                    </div>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitBeat)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Night Vibes" {...field} data-testid="input-beat-title" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="genre"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Genre</FormLabel>
                              <FormControl>
                                <Input placeholder="Hip Hop" {...field} data-testid="input-beat-genre" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="bpm"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>BPM</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="140" {...field} data-testid="input-beat-bpm" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="50" {...field} data-testid="input-beat-price" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button type="submit" className="w-full" data-testid="button-submit-beat">
                          Add Beat to Sync Licensing
                        </Button>
                      </form>
                    </Form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {beatsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : beats && beats.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>BPM</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {beats.map((beat) => (
                    <TableRow key={beat.id} data-testid={`row-beat-${beat.id}`}>
                      <TableCell className="font-medium">{beat.title}</TableCell>
                      <TableCell>{beat.genre}</TableCell>
                      <TableCell>{beat.bpm} BPM</TableCell>
                      <TableCell className="font-mono">
                        ${(beat.price / 100).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(beat.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteBeat(beat.id)}
                          data-testid={`button-delete-beat-${beat.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No beats uploaded yet. Click "Add Beat" to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
