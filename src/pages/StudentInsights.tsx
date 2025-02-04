import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StudentInsights = () => {
  const insights = [
    {
      title: "Class Performance",
      value: "85%",
      description: "Average class performance",
    },
    {
      title: "Engagement Rate",
      value: "78%",
      description: "Student participation rate",
    },
    {
      title: "At-Risk Students",
      value: "3",
      description: "Students needing attention",
    },
    {
      title: "Top Performers",
      value: "8",
      description: "Consistently high achievers",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight) => (
          <Card key={insight.title} className="neumorphic">
            <CardHeader>
              <CardTitle className="text-lg">{insight.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{insight.value}</p>
              <p className="text-sm text-muted-foreground">
                {insight.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="neumorphic">
        <CardHeader>
          <CardTitle>Student Progress Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] neumorphic-inset rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Progress Chart</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentInsights;