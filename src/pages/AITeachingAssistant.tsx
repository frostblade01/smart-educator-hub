import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AITeachingAssistant = () => {
  const [lessonDetails, setLessonDetails] = useState("");
  const [teachingStyle, setTeachingStyle] = useState("text");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Lesson plan generated successfully!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Teaching Assistant</h1>
      
      <Tabs defaultValue="lesson-planner" className="w-full">
        <TabsList className="neumorphic">
          <TabsTrigger value="lesson-planner">Lesson Planner</TabsTrigger>
          <TabsTrigger value="virtual-teacher">Virtual Teacher</TabsTrigger>
        </TabsList>

        <TabsContent value="lesson-planner">
          <Card className="neumorphic">
            <CardHeader>
              <CardTitle>AI Lesson Planner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Lesson Details</Label>
                <Textarea
                  placeholder="Enter your lesson topic, objectives, and any specific requirements..."
                  value={lessonDetails}
                  onChange={(e) => setLessonDetails(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <div className="space-y-4">
                <Label>Teaching Style</Label>
                <RadioGroup
                  value={teachingStyle}
                  onValueChange={setTeachingStyle}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="text" />
                    <Label htmlFor="text">Text-based</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="visual" id="visual" />
                    <Label htmlFor="visual">Visual-heavy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interactive" id="interactive" />
                    <Label htmlFor="interactive">Interactive</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handleGeneratePlan}
                disabled={!lessonDetails || isGenerating}
                className="w-full neumorphic-button"
              >
                {isGenerating ? "Generating..." : "Generate Lesson Plan"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="virtual-teacher">
          <Card className="neumorphic">
            <CardHeader>
              <CardTitle>AI Virtual Teacher</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video neumorphic-inset rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Virtual Teaching Session</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Start Session", "Pause", "End Session"].map((action) => (
                  <Button
                    key={action}
                    onClick={() => toast.info(`${action} clicked`)}
                    className="neumorphic-button"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITeachingAssistant;