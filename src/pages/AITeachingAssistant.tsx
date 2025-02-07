
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, BookOpen, Presentation } from "lucide-react";
import { LessonPlannerForm } from "@/components/teaching/LessonPlannerForm";
import { VirtualTeacher } from "@/components/teaching/VirtualTeacher";
import { useLessonVideos } from "@/hooks/useLessonVideos";

const AITeachingAssistant = () => {
  const [sessionTime, setSessionTime] = useState(0);
  const { refetch: refetchVideos } = useLessonVideos();

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
          <LessonPlannerForm onVideoGenerated={refetchVideos} />
        </TabsContent>

        <TabsContent value="virtual-teacher">
          <VirtualTeacher />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITeachingAssistant;
