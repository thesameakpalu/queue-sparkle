import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface QueueData {
  name: string;
  served: number;
  waiting: number;
  avgTime: number;
}

interface ReportsSectionProps {
  queueData: QueueData[];
  totalServed: number;
  totalWaiting: number;
  averageWaitTime: number;
}

export const ReportsSection = ({
  queueData,
  totalServed,
  totalWaiting,
  averageWaitTime,
}: ReportsSectionProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const headers = ["Activity", "Customers Served", "Currently Waiting", "Avg Service Time (s)"];
    const rows = queueData.map((q) => [q.name, q.served, q.waiting, q.avgTime]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
      "",
      `Total Served,${totalServed}`,
      `Total Waiting,${totalWaiting}`,
      `Average Wait Time,${averageWaitTime}s`,
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `queue-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-3 no-print">
        <Button onClick={handlePrint} variant="default" className="gap-2">
          <Printer className="w-4 h-4" />
          Print Report
        </Button>
        <Button onClick={handleDownloadCSV} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download CSV
        </Button>
      </div>

      {/* Report Content */}
      <Card className="shadow-ug print:shadow-none">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-3xl ug-gradient bg-clip-text text-transparent">
            University of Ghana
          </CardTitle>
          <CardTitle className="text-2xl mt-2">Queue Management Report</CardTitle>
          <CardDescription className="text-base mt-2">{currentDate}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Summary Statistics */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Summary Statistics</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Served</p>
                <p className="text-3xl font-bold text-primary mt-1">{totalServed}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Currently Waiting</p>
                <p className="text-3xl font-bold text-accent mt-1">{totalWaiting}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  {Math.floor(averageWaitTime / 60)}:{(averageWaitTime % 60).toString().padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Queue Breakdown */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Queue Breakdown by Activity</h3>
            <div className="space-y-3">
              {queueData.map((queue, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{queue.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Avg service time: {queue.avgTime}s
                    </p>
                  </div>
                  <div className="flex gap-8 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{queue.served}</p>
                      <p className="text-xs text-muted-foreground">Served</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">{queue.waiting}</p>
                      <p className="text-xs text-muted-foreground">Waiting</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>Generated on {new Date().toLocaleString()}</p>
            <p className="mt-2">University of Ghana - Office of the Registrar</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
