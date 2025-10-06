import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, RotateCcw, SkipForward, ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Activity types
const ACTIVITIES = [
  { id: "pay-fees", label: "Pay Fees", icon: "💰" },
  { id: "request-transcript", label: "Request Transcript", icon: "📄" },
  { id: "general-inquiry", label: "General Inquiry", icon: "❓" },
  { id: "course-registration", label: "Course Registration", icon: "📚" },
];

// Queue data structure
interface ActivityQueue {
  currentNumber: number;
  servingNumber: number;
  tickets: number[];
}

interface AllQueuesData {
  [activityId: string]: ActivityQueue;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Check authentication
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const [queuesData, setQueuesData] = useState<AllQueuesData>(() => {
    const saved = localStorage.getItem("allQueuesData");
    if (saved) {
      return JSON.parse(saved);
    }
    const initial: AllQueuesData = {};
    ACTIVITIES.forEach((activity) => {
      initial[activity.id] = {
        currentNumber: 0,
        servingNumber: 0,
        tickets: [],
      };
    });
    return initial;
  });

  // Persist queue data
  useEffect(() => {
    localStorage.setItem("allQueuesData", JSON.stringify(queuesData));
  }, [queuesData]);

  // Format queue number
  const formatQueueNumber = (num: number): string => {
    return `Q${num.toString().padStart(3, "0")}`;
  };

  // Call next customer for specific activity
  const callNext = (activityId: string) => {
    const queue = queuesData[activityId];
    if (queue.tickets.length === 0) {
      toast({
        title: "No customers waiting",
        description: "The queue is empty",
        variant: "destructive",
      });
      return;
    }

    const nextNumber = queue.tickets[0];
    setQueuesData((prev) => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        servingNumber: nextNumber,
        tickets: prev[activityId].tickets.slice(1),
      },
    }));

    const activityLabel = ACTIVITIES.find((a) => a.id === activityId)?.label;
    toast({
      title: "Now Serving",
      description: `${activityLabel}: ${formatQueueNumber(nextNumber)}`,
    });
  };

  // Skip current number for specific activity
  const skipNumber = (activityId: string) => {
    const queue = queuesData[activityId];
    if (queue.tickets.length === 0) {
      toast({
        title: "No customers to skip",
        description: "The queue is empty",
        variant: "destructive",
      });
      return;
    }

    const skippedNumber = queue.tickets[0];
    setQueuesData((prev) => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        tickets: prev[activityId].tickets.slice(1),
      },
    }));

    toast({
      title: "Customer Skipped",
      description: `${formatQueueNumber(skippedNumber)} has been removed`,
    });
  };

  // Reset queue for specific activity
  const resetQueue = (activityId: string) => {
    setQueuesData((prev) => ({
      ...prev,
      [activityId]: {
        currentNumber: 0,
        servingNumber: 0,
        tickets: [],
      },
    }));

    const activityLabel = ACTIVITIES.find((a) => a.id === activityId)?.label;
    toast({
      title: "Queue Reset",
      description: `${activityLabel} queue has been cleared`,
    });
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Logout */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
            Home
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage all queues and serve customers
          </p>
        </div>

        {/* Queue Management Tabs */}
        <Tabs defaultValue={ACTIVITIES[0].id} className="animate-scale-in">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            {ACTIVITIES.map((activity) => (
              <TabsTrigger key={activity.id} value={activity.id}>
                {activity.icon} {activity.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {ACTIVITIES.map((activity) => {
            const queue = queuesData[activity.id];
            return (
              <TabsContent key={activity.id} value={activity.id} className="space-y-6">
                {/* Current Serving Display */}
                <Card className="border-2 shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">
                      {activity.icon} Now Serving - {activity.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="py-8 px-4">
                      <div className="text-8xl md:text-9xl font-bold text-primary animate-pulse-glow">
                        {queue.servingNumber > 0
                          ? formatQueueNumber(queue.servingNumber)
                          : "---"}
                      </div>
                    </div>

                    {queue.tickets.length > 0 && (
                      <div className="mt-6 pt-6 border-t">
                        <p className="text-muted-foreground mb-2">Next Up</p>
                        <p className="text-3xl font-semibold text-accent">
                          {formatQueueNumber(queue.tickets[0])}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Controls */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-6 h-6 text-primary" />
                      Queue Controls
                    </CardTitle>
                    <CardDescription>Manage the {activity.label} queue</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={() => callNext(activity.id)}
                      size="lg"
                      className="w-full"
                      disabled={queue.tickets.length === 0}
                    >
                      <UserCheck className="w-5 h-5" />
                      Call Next Customer
                    </Button>

                    <Separator />

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => skipNumber(activity.id)}
                        variant="outline"
                        disabled={queue.tickets.length === 0}
                      >
                        <SkipForward className="w-4 h-4" />
                        Skip
                      </Button>

                      <Button
                        onClick={() => resetQueue(activity.id)}
                        variant="destructive"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </Button>
                    </div>

                    {/* Queue Stats */}
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Ticket:</span>
                        <span className="font-semibold">
                          {queue.currentNumber > 0
                            ? formatQueueNumber(queue.currentNumber)
                            : "None"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Currently Serving:</span>
                        <span className="font-semibold">
                          {queue.servingNumber > 0
                            ? formatQueueNumber(queue.servingNumber)
                            : "None"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">In Queue:</span>
                        <span className="font-semibold">{queue.tickets.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Waiting List */}
                {queue.tickets.length > 0 && (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Waiting List</CardTitle>
                      <CardDescription>Current customers in queue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {queue.tickets.map((ticket, index) => (
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
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
