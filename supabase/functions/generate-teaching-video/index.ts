
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const REPLICATE_API_TOKEN = Deno.env.get('REPLICATE_API_TOKEN')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { lessonData } = await req.json()
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate video using Replicate's D-ID API
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "aa96e8c43dad0712495d99f8bba8d58a11c6da1edec79f20473b1fd38781f148",
        input: {
          audio_path: null,
          driver_path: null,
          text: lessonData.script,
          source_image: "https://replicate.delivery/pbxt/QbP6Fh3ZXwKON8IvYGXBD2ZTyxJXVxKZBjJjB00jjnk60prE/image.jpg",
          result_format: "mp4"
        }
      }),
    })

    const prediction = await response.json()
    console.log("Started video generation:", prediction)

    // Save video details to database
    const { data: lessonVideo, error: dbError } = await supabase
      .from('lesson_videos')
      .insert({
        lesson_id: lessonData.lessonId,
        url: prediction.urls?.get,
        title: lessonData.title,
        duration: lessonData.duration
      })
      .select()
      .single()

    if (dbError) throw dbError

    return new Response(
      JSON.stringify({ 
        success: true, 
        video: lessonVideo,
        predictionId: prediction.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
