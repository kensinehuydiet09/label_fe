import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, CreditCard, Loader2, Copy, ArrowRightCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';
import Constants from "@/constants";
import { apiService } from "@/services/api";

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [bankAmount, setBankAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await apiService.post(
        Constants.API_ENDPOINTS.USER_CHECKOUT_SESSION,
        { amount: parseFloat(amount) }
      );
      
      if (response.success) {
        const link = response.data.url;
        console.log("Redirect URL:", link);
        
        // Show success toast
        toast({
          title: "Payment Processing",
          description: "Redirecting you to the payment gateway...",
          duration: 1400,
        });
        
        // Wait 1.5 seconds before redirecting
        setTimeout(() => {
          window.location.href = link;
        }, 1500);
      } else {
        setIsLoading(false);
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setIsLoading(false);
      setError("Failed to process payment. Please try again later.");
    }
  };

  const copyBankDetails = () => {
    const bankDetails = `
      Bank Name: Example Bank
      Account Number: 1234 5678 9012 3456
      Account Name: Your Company Name
    `;
    
    navigator.clipboard.writeText(bankDetails.trim());
    
    toast({
      title: "Bank details copied",
      description: "Bank details have been copied to clipboard",
    });
  };

  const transactions = [
    { id: 1, type: "Deposit", amount: 500, date: new Date(), status: "Completed" },
    { id: 2, type: "Deposit", amount: 750, date: new Date(Date.now() - 86400000), status: "Completed" },
    { id: 3, type: "Deposit", amount: 250, date: new Date(Date.now() - 172800000), status: "Completed" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Deposit</h1>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-hidden border-2 border-primary/10">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Online Payment
              </CardTitle>
              <CardDescription>
                Deposit funds instantly using credit/debit card or other payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleDeposit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0.01"
                      step="0.01"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRightCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Bank Transfer
              </CardTitle>
              <CardDescription>
                Deposit funds via bank transfer (may take 1-2 business days to process)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="bank-amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="bank-amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={bankAmount}
                    onChange={(e) => setBankAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bank Name:</span>
                    <span className="font-medium">Example Bank</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-medium">1234 5678 9012 3456</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account Name:</span>
                    <span className="font-medium">Your Company Name</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={copyBankDetails}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Bank Details
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent deposit transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{transaction.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-emerald-600">+${transaction.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Deposit;
