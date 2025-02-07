
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Presentation, Timer, Trash2, Video } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useLessonVideos } from "@/hooks/useLessonVideos";

export const VirtualTeacher = () => {
  const [sessionTime, setSessionTime] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const { data: videos, refetch: refetchVideos } = useLessonVideos();

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
  );
};
