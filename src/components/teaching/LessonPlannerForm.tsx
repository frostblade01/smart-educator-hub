
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Brain, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LessonPlannerFormProps {
  onVideoGenerated: () => void;
}

export const LessonPlannerForm = ({ onVideoGenerated }: LessonPlannerFormProps) => {
  const [lessonDetails, setLessonDetails] = useState("");
  const [teachingStyle, setTeachingStyle] = useState("text");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

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
          user_id: 'default' // Adding required user_id field with a default value
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
          onVideoGenerated();
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

  return (
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
  );
};
