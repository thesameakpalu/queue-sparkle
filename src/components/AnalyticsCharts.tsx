import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface QueueData {
  name: string;
  served: number;
  waiting: number;
  avgTime: number;
}

interface AnalyticsChartsProps {
  queueData: QueueData[];
  hourlyData: { hour: string; customers: number }[];
}

const COLORS = {
  primary: "hsl(0, 70%, 45%)",
  accent: "hsl(45, 100%, 51%)",
  muted: "hsl(0, 0%, 65%)",
};

export const AnalyticsCharts = ({ queueData, hourlyData }: AnalyticsChartsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Queue Performance Bar Chart */}
      <Card className="shadow-ug">
        <CardHeader>
          <CardTitle>Queue Performance</CardTitle>
          <CardDescription>Served vs Waiting by Activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={queueData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="served" fill={COLORS.primary} name="Served" radius={[8, 8, 0, 0]} />
              <Bar dataKey="waiting" fill={COLORS.accent} name="Waiting" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Average Service Time */}
      <Card className="shadow-ug">
        <CardHeader>
          <CardTitle>Average Service Time</CardTitle>
          <CardDescription>Time spent per customer (seconds)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={queueData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="avgTime" fill={COLORS.primary} name="Avg Time (s)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Hourly Traffic */}
      <Card className="shadow-ug">
        <CardHeader>
          <CardTitle>Hourly Traffic</CardTitle>
          <CardDescription>Customer flow throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Line
                type="monotone"
                dataKey="customers"
                stroke={COLORS.primary}
                strokeWidth={3}
                dot={{ fill: COLORS.accent, r: 5 }}
                name="Customers"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Queue Distribution Pie Chart */}
      <Card className="shadow-ug">
        <CardHeader>
          <CardTitle>Queue Distribution</CardTitle>
          <CardDescription>Customers served by activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={queueData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="served"
              >
                {queueData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 2 === 0 ? COLORS.primary : COLORS.accent}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
