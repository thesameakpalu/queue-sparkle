import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Ticket, UserCheck, RotateCcw, SkipForward, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Type definitions for queue management
interface QueueData {
  currentNumber: number;
  servingNumber: number;
  tickets: number[];
}

const Index = () => {
  // Initialize state from localStorage or default values
  const [queueData, setQueueData] = useState<QueueData>(() => {
    const saved = localStorage.getItem("queueData");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      currentNumber: 0,
      servingNumber: 0,
      tickets: [],
    };
  });

  // Persist queue data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("queueData", JSON.stringify(queueData));
  }, [queueData]);

  // Format queue number with leading zeros (e.g., Q001, Q023)
  const formatQueueNumber = (num: number): string => {
    return `Q${num.toString().padStart(3, "0")}`;
  };

  // Handle getting a new ticket
  const getTicket = () => {
    const newNumber = queueData.currentNumber + 1;
    setQueueData((prev) => ({
      ...prev,
      currentNumber: newNumber,
      tickets: [...prev.tickets, newNumber],
    }));

    toast({
      title: "Ticket Issued",
      description: `Your number is ${formatQueueNumber(newNumber)}`,
    });
  };

  // Handle calling the next customer
  const callNext = () => {
    if (queueData.tickets.length === 0) {
      toast({
        title: "No customers waiting",
        description: "The queue is empty",
        variant: "destructive",
      });
      return;
    }

    const nextNumber = queueData.tickets[0];
    setQueueData((prev) => ({
      ...prev,
      servingNumber: nextNumber,
      tickets: prev.tickets.slice(1),
    }));

    toast({
      title: "Now Serving",
      description: `Calling ${formatQueueNumber(nextNumber)}`,
    });
  };

  // Handle skipping current number
  const skipNumber = () => {
    if (queueData.tickets.length === 0) {
      toast({
        title: "No customers to skip",
        description: "The queue is empty",
        variant: "destructive",
      });
      return;
    }

    const skippedNumber = queueData.tickets[0];
    setQueueData((prev) => ({
      ...prev,
      tickets: prev.tickets.slice(1),
    }));

    toast({
      title: "Customer Skipped",
      description: `${formatQueueNumber(skippedNumber)} has been removed from queue`,
    });
  };

  // Handle resetting the entire queue
  const resetQueue = () => {
    setQueueData({
      currentNumber: 0,
      servingNumber: 0,
      tickets: [],
    });

    toast({
      title: "Queue Reset",
      description: "All queue data has been cleared",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Queue Management System
          </h1>
          <p className="text-muted-foreground text-lg">
            Simple and efficient queue tracking
          </p>
        </div>

        {/* Main Display - Current Serving Number */}
        <Card className="border-2 shadow-lg animate-scale-in">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Now Serving</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="py-8 px-4">
              <div className="text-8xl md:text-9xl font-bold text-primary animate-pulse-glow">
                {queueData.servingNumber > 0
                  ? formatQueueNumber(queueData.servingNumber)
                  : "---"}
              </div>
            </div>
            
            {queueData.tickets.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-muted-foreground mb-2">Next Up</p>
                <p className="text-3xl font-semibold text-accent">
                  {formatQueueNumber(queueData.tickets[0])}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* User Section - Get Ticket */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-6 h-6 text-primary" />
                Get Your Ticket
              </CardTitle>
              <CardDescription>
                Click the button below to receive your queue number
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={getTicket}
                size="lg"
                variant="accent"
                className="w-full h-16 text-lg"
              >
                <Ticket className="w-6 h-6" />
                Get New Ticket
              </Button>

              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>People Waiting</span>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {queueData.tickets.length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Admin Section - Controls */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-primary" />
                Admin Controls
              </CardTitle>
              <CardDescription>
                Manage the queue and serve customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={callNext}
                size="lg"
                className="w-full"
                disabled={queueData.tickets.length === 0}
              >
                <UserCheck className="w-5 h-5" />
                Call Next Customer
              </Button>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={skipNumber}
                  variant="outline"
                  disabled={queueData.tickets.length === 0}
                >
                  <SkipForward className="w-4 h-4" />
                  Skip
                </Button>

                <Button
                  onClick={resetQueue}
                  variant="destructive"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Ticket:</span>
                  <span className="font-semibold">
                    {queueData.currentNumber > 0
                      ? formatQueueNumber(queueData.currentNumber)
                      : "None"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currently Serving:</span>
                  <span className="font-semibold">
                    {queueData.servingNumber > 0
                      ? formatQueueNumber(queueData.servingNumber)
                      : "None"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">In Queue:</span>
                  <span className="font-semibold">{queueData.tickets.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Queue List */}
        {queueData.tickets.length > 0 && (
          <Card className="shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle>Waiting List</CardTitle>
              <CardDescription>
                Current customers in queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {queueData.tickets.map((ticket, index) => (
                  <div
                    key={ticket}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      index === 0
                        ? "bg-accent text-accent-foreground shadow-md scale-105"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {formatQueueNumber(ticket)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
