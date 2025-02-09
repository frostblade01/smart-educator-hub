
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

    // Create initial video record with pending status
    const { data: lessonVideo, error: dbError } = await supabase
      .from('lesson_videos')
      .insert({
        lesson_id: lessonData.lessonId,
        title: lessonData.title,
        duration: lessonData.duration,
        status: 'pending'
      })
      .select()
      .single()

    if (dbError) throw dbError

    // Generate video using Replicate's text-to-speech model
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "9c6bb482096631b5dd50665241501e86883471fd37fe144b8d3ef466fbeb32a5",
        input: {
          text: lessonData.script,
          voice: "emma",
          language: "en"
        }
      }),
    })

    const prediction = await response.json()
    console.log("Started video generation:", prediction)

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
