import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  UserCheck,
  RotateCcw,
  SkipForward,
  ArrowLeft,
  LogOut,
  Clock,
  BarChart3,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { StatisticsCards } from "@/components/StatisticsCards";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { ReportsSection } from "@/components/ReportsSection";

// Activity definitions (with real prefixes)
const ACTIVITIES = [
  { id: "pay-fees", label: "Pay Fees", icon: "💰", prefix: "F" },
  { id: "request-transcript", label: "Request Transcript", icon: "📄", prefix: "T" },
  { id: "general-inquiry", label: "General Inquiry", icon: "❓", prefix: "G" },
  { id: "course-registration", label: "Course Registration", icon: "📚", prefix: "C" },
];

interface ActivityQueue {
  currentNumber: number;
  servingNumber: number;
  tickets: number[];
  servedCount: number;
  totalServiceTime: number;
}

interface AllQueuesData {
  [activityId: string]: ActivityQueue;
}

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) navigate("/admin-login");
  }, [navigate]);

  const [queuesData, setQueuesData] = useState<AllQueuesData>(() => {
    const saved = localStorage.getItem("allQueuesData");
    if (saved) return JSON.parse(saved);

    const initial: AllQueuesData = {};
    ACTIVITIES.forEach((activity) => {
      initial[activity.id] = {
        currentNumber: 0,
        servingNumber: 0,
        tickets: [],
        servedCount: 0,
        totalServiceTime: 0,
      };
    });
    return initial;
  });

  // Timer states
  const [timerStartTimes, setTimerStartTimes] = useState<{ [key: string]: number | null }>({});
  const [elapsedTimes, setElapsedTimes] = useState<{ [key: string]: number }>({});

  // Update elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const updated: { [key: string]: number } = {};
      Object.keys(timerStartTimes).forEach((activityId) => {
        const start = timerStartTimes[activityId];
        if (start) updated[activityId] = Math.floor((Date.now() - start) / 1000);
      });
      setElapsedTimes((prev) => ({ ...prev, ...updated }));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerStartTimes]);

  // Persist queue data
  useEffect(() => {
    localStorage.setItem("allQueuesData", JSON.stringify(queuesData));
  }, [queuesData]);

  const formatQueueNumber = (num: number, prefix?: string): string =>
    `${prefix ?? "Q"}${num.toString().padStart(3, "0")}`;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // ✅ FIXED VERSION — Call next customer and start timer
  const callNext = (activityId: string) => {
    const queue = queuesData[activityId];

    if (queue.tickets.length === 0)
      return toast({
        title: "No customers waiting",
        description: "The queue is empty",
        variant: "destructive",
      });

    const nextNumber = queue.tickets[0];
    const now = Date.now();

    setQueuesData((prev) => {
      const currentQueue = prev[activityId];
      const prevServedCount = currentQueue.servedCount ?? 0;
      const prevTotalServiceTime = currentQueue.totalServiceTime ?? 0;

      // If there was a previous customer, record their service time and increment served count
      const serviceTime =
        currentQueue.servingNumber > 0 && timerStartTimes[activityId]
          ? Math.floor((now - timerStartTimes[activityId]!) / 1000)
          : 0;

      return {
        ...prev,
        [activityId]: {
          ...currentQueue,
          servedCount:
            prevServedCount + (currentQueue.servingNumber > 0 ? 1 : 0),
          totalServiceTime:
            prevTotalServiceTime +
            (currentQueue.servingNumber > 0 ? serviceTime : 0),
          servingNumber: nextNumber,
          tickets: currentQueue.tickets.slice(1),
        },
      };
    });

    // Start timer for new customer
    setTimerStartTimes((prev) => ({
      ...prev,
      [activityId]: now,
    }));
    setElapsedTimes((prev) => ({
      ...prev,
      [activityId]: 0,
    }));

    const activity = ACTIVITIES.find((a) => a.id === activityId);
    toast({
      title: "Now Serving",
      description: `${activity?.label}: ${formatQueueNumber(nextNumber, activity?.prefix)}`,
    });
  };

  // Skip customer and reset timer
  const skipNumber = (activityId: string) => {
    const queue = queuesData[activityId];
    if (queue.tickets.length === 0)
      return toast({
        title: "No customers to skip",
        description: "The queue is empty",
        variant: "destructive",
      });

    const skipped = queue.tickets[0];
    setQueuesData((prev) => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        tickets: prev[activityId].tickets.slice(1),
      },
    }));

    // Reset timer
    setTimerStartTimes((prev) => ({
      ...prev,
      [activityId]: null,
    }));
    setElapsedTimes((prev) => ({
      ...prev,
      [activityId]: 0,
    }));

    toast({
      title: "Customer Skipped",
      description: `${formatQueueNumber(skipped)} has been removed`,
    });
  };

  // Reset queue and timer
  const resetQueue = (activityId: string) => {
    setQueuesData((prev) => ({
      ...prev,
      [activityId]: { 
        currentNumber: 0, 
        servingNumber: 0, 
        tickets: [],
        servedCount: 0,
        totalServiceTime: 0,
      },
    }));
    setTimerStartTimes((prev) => ({
      ...prev,
      [activityId]: null,
    }));
    setElapsedTimes((prev) => ({
      ...prev,
      [activityId]: 0,
    }));

    const activity = ACTIVITIES.find((a) => a.id === activityId);
    toast({
      title: "Queue Reset",
      description: `${activity?.label} queue has been cleared`,
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    toast({ title: "Logged Out", description: "You have been logged out." });
    navigate("/");
  };

  // Calculate statistics safely
const stats = {
  totalServed: Object.values(queuesData).reduce(
    (sum, q) => sum + (Number.isFinite(q.servedCount) ? q.servedCount : 0),
    0
  ),
  totalWaiting: Object.values(queuesData).reduce(
    (sum, q) => sum + (q.tickets?.length ?? 0),
    0
  ),
  averageWaitTime: (() => {
    const total = Object.values(queuesData).reduce(
      (sum, q) => sum + (Number.isFinite(q.totalServiceTime) ? q.totalServiceTime : 0),
      0
    );
    const count = Object.values(queuesData).reduce(
      (sum, q) => sum + (Number.isFinite(q.servedCount) ? q.servedCount : 0),
      0
    );
    return count > 0 ? Math.floor(total / count) : 0;
  })(),
  activeQueues: Object.values(queuesData).filter((q) => q.servingNumber > 0).length,
};


  // Prepare chart data
  const queueChartData = ACTIVITIES.map((activity) => {
    const queue = queuesData[activity.id];
    const avgTime = queue.servedCount > 0 
      ? Math.floor(queue.totalServiceTime / queue.servedCount) 
      : 0;
    return {
      name: activity.label,
      served: queue.servedCount,
      waiting: queue.tickets.length,
      avgTime,
    };
  });

  // Generate mock hourly data (in real app, this would be tracked)
  const hourlyData = Array.from({ length: 10 }, (_, i) => ({
    hour: `${8 + i}:00`,
    customers: Math.floor(Math.random() * 15) + 5,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center no-print">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" /> Home
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold ug-gradient bg-clip-text text-transparent">
            University of Ghana
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Queue Management System
          </h2>
          <p className="text-muted-foreground text-lg">
            Admin Dashboard
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="animate-scale-in">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid no-print">
            <TabsTrigger value="overview">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <StatisticsCards stats={stats} />

            {/* Queue Management by Activity */}
            <Tabs defaultValue={ACTIVITIES[0].id}>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                {ACTIVITIES.map((activity) => (
                  <TabsTrigger key={activity.id} value={activity.id}>
                    {activity.icon} {activity.label} ({activity.prefix})
                  </TabsTrigger>
                ))}
              </TabsList>

              {ACTIVITIES.map((activity) => {
                const queue = queuesData[activity.id];
                const elapsed = elapsedTimes[activity.id] || 0;

                return (
                  <TabsContent key={activity.id} value={activity.id} className="space-y-6">
                    {/* Current Serving */}
                    <Card className="border-2 border-primary/20 shadow-ug">
                      <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl">
                          {activity.icon} Now Serving - {activity.label} ({activity.prefix})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="py-8 px-4">
                          <div className="text-8xl md:text-9xl font-bold text-primary animate-pulse-glow">
                            {queue.servingNumber > 0
                              ? formatQueueNumber(queue.servingNumber, activity.prefix)
                              : "---"}
                          </div>
                          {queue.servingNumber > 0 && (
                            <div className="mt-4 flex items-center justify-center gap-2 text-lg text-muted-foreground">
                              <Clock className="w-5 h-5" />
                              <span>Serving for {formatTime(elapsed)}</span>
                            </div>
                          )}
                        </div>

                        {queue.tickets.length > 0 && (
                          <div className="mt-6 pt-6 border-t">
                            <p className="text-muted-foreground mb-2">Next Up</p>
                            <p className="text-3xl font-semibold text-accent">
                              {formatQueueNumber(queue.tickets[0], activity.prefix)}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              {queue.tickets.length - 1} more waiting
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Controls */}
                    <Card className="shadow-ug">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <UserCheck className="w-6 h-6 text-primary" />
                          Queue Controls
                        </CardTitle>
                        <CardDescription>
                          Manage the {activity.label} queue - {queue.servedCount} served today
                        </CardDescription>
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
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <StatisticsCards stats={stats} />
            <AnalyticsCharts queueData={queueChartData} hourlyData={hourlyData} />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <ReportsSection
              queueData={queueChartData}
              totalServed={stats.totalServed}
              totalWaiting={stats.totalWaiting}
              averageWaitTime={stats.averageWaitTime}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
