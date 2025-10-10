import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, TrendingUp, Activity } from "lucide-react";

interface Stats {
  totalServed: number;
  totalWaiting: number;
  averageWaitTime: number;
  activeQueues: number;
}

interface StatisticsCardsProps {
  stats: Stats;
}

export const StatisticsCards = ({ stats }: StatisticsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-primary/20 shadow-ug">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Served Today</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalServed}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Customers completed
          </p>
        </CardContent>
      </Card>

      <Card className="border-accent/20 shadow-ug">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Currently Waiting</CardTitle>
          <Activity className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{stats.totalWaiting}</div>
          <p className="text-xs text-muted-foreground mt-1">
            In all queues
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 shadow-ug">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {Math.floor(stats.averageWaitTime / 60)}m {stats.averageWaitTime % 60}s
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Per customer
          </p>
        </CardContent>
      </Card>

      <Card className="border-accent/20 shadow-ug">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Queues</CardTitle>
          <TrendingUp className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{stats.activeQueues}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Currently serving
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
