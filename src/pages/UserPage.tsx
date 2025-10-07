import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Activity types available for users
const ACTIVITIES = [
  { id: "pay-fees", label: "Pay Fees", icon: "💰" },
  { id: "request-transcript", label: "Request Transcript", icon: "📄" },
  { id: "general-inquiry", label: "General Inquiry", icon: "❓" },
  { id: "course-registration", label: "Course Registration", icon: "📚" },
];

// Queue data structure for multiple activities
interface ActivityQueue {
  currentNumber: number;
  servingNumber: number;
  tickets: number[];
}

interface AllQueuesData {
  [activityId: string]: ActivityQueue;
}

const UserPage = () => {
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [myTicket, setMyTicket] = useState<{ activity: string; number: number } | null>(null);
  const [queuesData, setQueuesData] = useState<AllQueuesData>(() => {
    const saved = localStorage.getItem("allQueuesData");
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize empty queues for all activities
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

  // Persist queue data to localStorage
  useEffect(() => {
    localStorage.setItem("allQueuesData", JSON.stringify(queuesData));
  }, [queuesData]);

  // Map each activity to its queue prefix
const getActivityPrefix = (activityId: string): string => {
  switch (activityId) {
    case "pay-fees":
      return "F"; // Fees
    case "request-transcript":
      return "T"; // Transcript
    case "general-inquiry":
      return "G"; // General
    case "course-registration":
      return "C"; // Course
    default:
      return "Q"; // Default prefix
  }
};


  // Format queue number with leading zeros and activity prefix
const formatQueueNumber = (activityId: string, num: number): string => {
  const prefix = getActivityPrefix(activityId);
  return `${prefix}${num.toString().padStart(3, "0")}`;
};


  // Handle getting a ticket for selected activity
  const getTicket = () => {
    if (!selectedActivity) return;

    const queue = queuesData[selectedActivity];
    const newNumber = queue.currentNumber + 1;

    setQueuesData((prev) => ({
      ...prev,
      [selectedActivity]: {
        ...prev[selectedActivity],
        currentNumber: newNumber,
        tickets: [...prev[selectedActivity].tickets, newNumber],
      },
    }));

    setMyTicket({ activity: selectedActivity, number: newNumber });

    toast({
      title: "Ticket Issued",
      description: `Your number is ${formatQueueNumber(selectedActivity, newNumber)}`,
    });
  };

  const activityLabel = ACTIVITIES.find((a) => a.id === selectedActivity)?.label || "";
  const currentQueue = selectedActivity ? queuesData[selectedActivity] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="outline" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            User Queue
          </h1>
          <p className="text-muted-foreground text-lg">
            Select your purpose of visit and get your queue number
          </p>
        </div>

        {!myTicket ? (
          <>
            {/* Activity Selection */}
            {!selectedActivity && (
              <Card className="shadow-lg animate-scale-in">
                <CardHeader>
                  <CardTitle className="text-2xl">Select Your Purpose</CardTitle>
                  <CardDescription>
                    Choose the service you need assistance with
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {ACTIVITIES.map((activity) => (
                    <Button
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity.id)}
                      size="lg"
                      variant="outline"
                      className="h-24 text-lg flex flex-col gap-2"
                    >
                      <span className="text-3xl">{activity.icon}</span>
                      <span>{activity.label}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Get Ticket Section */}
            {selectedActivity && currentQueue && (
              <div className="space-y-6 animate-fade-in">
                <Card className="shadow-lg">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                      {ACTIVITIES.find((a) => a.id === selectedActivity)?.icon}{" "}
                      {activityLabel}
                    </CardTitle>
                    <CardDescription>
                      Click below to get your queue number
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Serving Display */}
                    <div className="text-center p-6 bg-secondary/50 rounded-lg">
                      <p className="text-muted-foreground mb-2">Currently Serving</p>
                      <div className="text-5xl font-bold text-primary">
                        {currentQueue.servingNumber > 0
                          ? formatQueueNumber(selectedActivity,currentQueue.servingNumber)
                          : "---"}
                      </div>
                    </div>

                    {/* Get Ticket Button */}
                    <Button
                      onClick={getTicket}
                      size="lg"
                      variant="accent"
                      className="w-full h-16 text-lg"
                    >
                      <Ticket className="w-6 h-6" />
                      Get Queue Ticket
                    </Button>

                    {/* Queue Stats */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">People Waiting</span>
                      <span className="text-2xl font-bold text-primary">
                        {currentQueue.tickets.length}
                      </span>
                    </div>

                    <Button
                      onClick={() => setSelectedActivity(null)}
                      variant="outline"
                      className="w-full"
                    >
                      Choose Different Activity
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        ) : (
          // Ticket Issued View
          <Card className="shadow-lg animate-scale-in">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Ticket Issued Successfully!</CardTitle>
              <CardDescription>
                {ACTIVITIES.find((a) => a.id === myTicket.activity)?.label}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border-2 border-primary/20">
                <p className="text-muted-foreground mb-2">Your Queue Number</p>
                <div className="text-7xl font-bold text-primary animate-pulse-glow">
                  {formatQueueNumber(selectedActivity,myTicket.number)}
                </div>
              </div>

              <div className="text-center p-6 bg-secondary/50 rounded-lg">
                <p className="text-muted-foreground mb-2">Currently Serving</p>
                <div className="text-4xl font-bold text-accent">
                  {queuesData[myTicket.activity].servingNumber > 0
                    ? formatQueueNumber(selectedActivity,queuesData[myTicket.activity].servingNumber)
                    : "---"}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">People Ahead of You</span>
                <span className="text-2xl font-bold text-primary">
                  {queuesData[myTicket.activity].tickets.indexOf(myTicket.number)}
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => {
                    setMyTicket(null);
                    setSelectedActivity(null);
                  }}
                  variant="accent"
                  className="w-full"
                >
                  Get Another Ticket
                </Button>
                <Button onClick={() => navigate("/")} variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserPage;
