
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

    // Generate video using Replicate's Wav2Lip model
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "16a37ad3d51a0c576558d5d4d3e454751277227636fb7475b9834030701e06f4",
        input: {
          face: "https://replicate.delivery/pbxt/IqA45T3zEqkGHBXkXjDWZMxWTqOONHzBlu9YrisV52wJQPAj/face.jpg",
          audio: null,
          text: lessonData.script,
          speaker: "en_speaker_9",
          voice_preset: "natural"
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
