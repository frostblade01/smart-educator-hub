import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ActivityGenerator = () => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateActivity = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Activity generated successfully!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Activity Generator</h1>

      <Card className="neumorphic">
        <CardHeader>
          <CardTitle>Generate Interactive Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            placeholder="Enter the topic or concept for which you want to generate activities..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="min-h-[150px]"
          />

          <Button
            onClick={handleGenerateActivity}
            disabled={!topic || isGenerating}
            className="w-full neumorphic-button"
          >
            {isGenerating ? "Generating..." : "Generate Activities"}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Quiz", "Discussion", "Simulation", "Problem-Solving"].map((type) => (
              <Card key={type} className="neumorphic-inset p-4">
                <h3 className="font-semibold mb-2">{type}</h3>
                <p className="text-sm text-muted-foreground">
                  Click to generate a {type.toLowerCase()} activity
                </p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityGenerator;