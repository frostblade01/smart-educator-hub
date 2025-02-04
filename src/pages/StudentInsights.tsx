import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AlertTriangle, Award, Brain, Users } from "lucide-react";

const StudentInsights = () => {
  // Sample data for the performance chart
  const performanceData = [
    { month: "Jan", performance: 75 },
    { month: "Feb", performance: 82 },
    { month: "Mar", performance: 78 },
    { month: "Apr", performance: 85 },
    { month: "May", performance: 88 },
    { month: "Jun", performance: 92 },
  ];

  const insights = [
    {
      title: "Class Performance",
      value: "85%",
      description: "Average class performance",
      icon: Award,
      trend: "+5% from last month",
      color: "text-green-500",
    },
    {
      title: "Engagement Rate",
      value: "78%",
      description: "Student participation rate",
      icon: Users,
      trend: "+3% from last month",
      color: "text-blue-500",
    },
    {
      title: "At-Risk Students",
      value: "3",
      description: "Students needing attention",
      icon: AlertTriangle,
      trend: "-1 from last month",
      color: "text-amber-500",
    },
    {
      title: "Learning Progress",
      value: "92%",
      description: "Course completion rate",
      icon: Brain,
      trend: "+8% from last month",
      color: "text-purple-500",
    },
  ];

  const atRiskStudents = [
    {
      name: "Alex Thompson",
      subject: "Mathematics",
      progress: 45,
      status: "Needs immediate attention",
    },
    {
      name: "Sarah Parker",
      subject: "Physics",
      progress: 52,
      status: "Showing improvement",
    },
    {
      name: "James Wilson",
      subject: "Chemistry",
      progress: 48,
      status: "Attendance issues",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Student Insights</h1>
        <span className="text-muted-foreground">Last updated: Today at 9:30 AM</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight) => (
          <Card key={insight.title} className="neumorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {insight.title}
              </CardTitle>
              <insight.icon className={`h-5 w-5 ${insight.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{insight.value}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {insight.description}
              </p>
              <p className={`text-sm mt-2 ${insight.color}`}>
                {insight.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="neumorphic">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                className="h-full"
                config={{
                  performance: {
                    theme: {
                      light: "hsl(var(--primary))",
                      dark: "hsl(var(--primary))",
                    },
                  },
                }}
              >
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="performance"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#performanceGradient)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="neumorphic">
          <CardHeader>
            <CardTitle>At-Risk Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {atRiskStudents.map((student) => (
                <div key={student.name} className="space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.subject} - {student.status}
                      </p>
                    </div>
                    <span className="text-sm font-medium">{student.progress}%</span>
                  </div>
                  <Progress value={student.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentInsights;