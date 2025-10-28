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
import { apiRequest } from "@/lib/queryClient";
import { LogOut, Download } from "lucide-react";
import { format } from "date-fns";

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

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: isAdmin,
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
      </div>
    </div>
  );
}
