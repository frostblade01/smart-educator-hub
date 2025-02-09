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
import { AlertCircle, BookOpen, Brain, Clock, Presentation, Save, Timer, Video, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const AITeachingAssistant = () => {
  const [lessonDetails, setLessonDetails] = useState("");
  const [teachingStyle, setTeachingStyle] = useState("text");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  // Fetch lesson videos
  const { data: videos, refetch: refetchVideos } = useQuery({
    queryKey: ['lesson_videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lesson_videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleGeneratePlan = async () => {
    if (!selectedGrade || !selectedSubject || !duration || !lessonDetails) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    try {
      // Create the lesson record
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .insert({
          title: `${selectedSubject} Lesson for ${selectedGrade}`,
          grade_level: selectedGrade,
          subject: selectedSubject,
          duration: parseInt(duration),
          teaching_style: teachingStyle,
          lesson_details: lessonDetails,
          user_id: 'anonymous'  // Set a default user_id for non-authenticated users
        })
        .select()
        .single();

      if (lessonError) throw lessonError;

      // Generate the teaching video
      setGeneratingVideo(true);
      const response = await fetch('/api/generate-teaching-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonData: {
            lessonId: lesson.id,
            title: `${selectedSubject} Lesson for ${selectedGrade}`,
            script: lessonDetails,
            duration: parseInt(duration)
          }
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setCurrentVideoId(data.video.id);
      toast.success("Video generation started!");

      // Start polling for video status
      const checkStatus = async () => {
        const statusResponse = await fetch('/api/check-video-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            predictionId: data.predictionId,
            videoId: data.video.id
          }),
        });

        const statusData = await statusResponse.json();
        if (statusData.status === 'succeeded') {
          toast.success("Video generated successfully!");
          refetchVideos();
          setGeneratingVideo(false);
          return;
        } else if (statusData.status === 'failed') {
          toast.error("Video generation failed. Please try again.");
          setGeneratingVideo(false);
          return;
        }

        // Continue polling
        setTimeout(checkStatus, 5000);
      };

      checkStatus();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to generate lesson plan and video");
      setGeneratingVideo(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('lesson_videos')
        .delete()
        .eq('id', videoId);
      
      if (error) throw error;
      
      toast.success("Video deleted successfully");
      refetchVideos();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to delete video");
    }
  };

  const handleStartSession = () => {
    setIsSessionActive(true);
    toast.success("Virtual teaching session started");
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
                <Label>Lesson Details & Script</Label>
                <Textarea
                  placeholder="Enter your lesson topic, objectives, and the script for the virtual teacher..."
                  value={lessonDetails}
                  onChange={(e) => setLessonDetails(e.target.value)}
                  className="min-h-[150px] neumorphic-inset"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleGeneratePlan}
                  disabled={!lessonDetails || isGenerating || generatingVideo}
                  className="w-full neumorphic-button"
                >
                  {(isGenerating || generatingVideo) ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                      {generatingVideo ? "Generating Video..." : "Generating..."}
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Lesson & Video
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
              {videos && videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <div key={video.id} className="relative">
                      {video.url ? (
                        <div className="space-y-2">
                          <video
                            src={video.url}
                            controls
                            poster={video.thumbnail_url}
                            className="w-full rounded-lg neumorphic"
                          >
                            Your browser does not support the video tag.
                          </video>
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">{video.title}</p>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteVideo(video.id)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video neumorphic flex items-center justify-center">
                          <div className="text-center">
                            <AlertCircle className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                            <p>Generating video...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
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
                      <p className="text-lg text-muted-foreground">
                        No videos yet. Generate a lesson plan to create your first virtual teaching video!
                      </p>
                    </div>
                  )}
                </div>
              )}

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
