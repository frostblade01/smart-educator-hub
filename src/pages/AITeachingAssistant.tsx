
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, BookOpen, Brain, Clock, Presentation, Save, Timer, Video } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const AITeachingAssistant = () => {
  const [lessonDetails, setLessonDetails] = useState("");
  const [teachingStyle, setTeachingStyle] = useState("text");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [duration, setDuration] = useState("");

  const handleGeneratePlan = () => {
    if (!selectedGrade || !selectedSubject || !duration) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Lesson plan generated successfully!");
    }, 2000);
  };

  const handleStartSession = () => {
    setIsSessionActive(true);
    toast.success("Virtual teaching session started");
    // Start session timer
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  };

  const handlePauseSession = () => {
    setIsSessionActive(false);
    toast.info("Session paused");
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    setSessionTime(0);
    toast.info("Session ended");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Teaching Assistant</h1>
        <Badge variant="outline" className="neumorphic">
          <Clock className="w-4 h-4 mr-2" />
          Session Time: {formatTime(sessionTime)}
        </Badge>
      </div>
      
      <Tabs defaultValue="lesson-planner" className="w-full">
        <TabsList className="neumorphic grid grid-cols-2 w-full md:w-[400px]">
          <TabsTrigger value="lesson-planner" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Lesson Planner
          </TabsTrigger>
          <TabsTrigger value="virtual-teacher" className="flex items-center gap-2">
            <Presentation className="w-4 h-4" />
            Virtual Teacher
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lesson-planner">
          <Card className="neumorphic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Lesson Planner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grade Level</Label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="neumorphic-inset">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Elementary", "Middle School", "High School"].map((grade) => (
                        <SelectItem key={grade} value={grade.toLowerCase()}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="neumorphic-inset">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Mathematics", "Science", "English", "History", "Art"].map((subject) => (
                        <SelectItem key={subject} value={subject.toLowerCase()}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input 
                    type="number" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="neumorphic-inset"
                    placeholder="e.g., 45"
                  />
                </div>

                <div className="space-y-2">
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
              </div>

              <div className="space-y-4">
                <Label>Lesson Details</Label>
                <Textarea
                  placeholder="Enter your lesson topic, objectives, and any specific requirements..."
                  value={lessonDetails}
                  onChange={(e) => setLessonDetails(e.target.value)}
                  className="min-h-[150px] neumorphic-inset"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleGeneratePlan}
                  disabled={!lessonDetails || isGenerating}
                  className="w-full neumorphic-button"
                >
                  {isGenerating ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Lesson Plan
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="neumorphic-button"
                  onClick={() => toast.success("Lesson plan saved as draft")}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="virtual-teacher">
          <Card className="neumorphic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                AI Virtual Teacher
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video neumorphic-inset rounded-lg flex flex-col items-center justify-center p-6">
                {isSessionActive ? (
                  <div className="space-y-4 text-center">
                    <Timer className="w-12 h-12 animate-pulse" />
                    <p className="text-2xl font-bold">{formatTime(sessionTime)}</p>
                    <p className="text-muted-foreground">Virtual Teaching Session in Progress</p>
                    <Progress value={sessionTime % 100} className="w-64" />
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <Presentation className="w-12 h-12 mx-auto" />
                    <p className="text-lg text-muted-foreground">Ready to start virtual teaching session</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={handleStartSession}
                  disabled={isSessionActive}
                  className="neumorphic-button"
                >
                  Start Session
                </Button>
                <Button
                  onClick={handlePauseSession}
                  disabled={!isSessionActive}
                  className="neumorphic-button"
                >
                  Pause
                </Button>
                <Button
                  onClick={handleEndSession}
                  disabled={!isSessionActive && sessionTime === 0}
                  className="neumorphic-button"
                >
                  End Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITeachingAssistant;
