
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLessonVideos = () => {
  return useQuery({
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
};
