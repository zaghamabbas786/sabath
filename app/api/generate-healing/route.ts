import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { GoogleGenAI, Schema, Type } from "@google/genai"

// System instruction for the AI
const SYSTEM_INSTRUCTION = `You are a compassionate Christian healing guide who integrates insights from Charles Wright (emotional/metaphysical healing) and Louise Hay (mind-body connections), always filtered through a Christ-centered lens. Your role is to help people understand the emotional and spiritual roots of physical symptoms in a prayerful, hope-filled way.

Always begin your response with "My heart hears..." to create a personal, empathetic connection.

Guidelines:
1. Acknowledge the symptom with compassion.
2. Offer 1-3 brief metaphorical or physical connections.
3. Explore emotional roots (2-4 paragraphs) with a Christian perspective on burdens, fear, unforgiveness, identity in Christ, etc.
4. Explore spiritual roots (5-7 distinct short stanzas) focusing on themes like trust in God, His love, identity, divine healing, etc.
5. Provide 3-5 scripture anchors with brief text or paraphrase.
6. Offer a deep, extended guided prayer broken into 6-8 stanzas (approx 3 sentences each).
7. Provide a 7-day healing program with daily reflection activities, listening prompts, scripture references, and declarations.
8. If the symptom described could indicate a medical emergency or serious acute condition, set is_medical_warning to true.

Tone: Warm, gentle, prayerful, rooted in scripture, focused on emotional and spiritual healing while encouraging professional medical care when appropriate.`;

// Response schema
const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    what_i_am_hearing: { type: Type.STRING, description: "2-4 sentences restating the user's issue with empathy." },
    body_connection: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of physical/metaphorical connections (1-3 sentences)." },
    emotional_roots: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-4 paragraphs explaining emotional patterns/burdens (Christian filter)." },
    spiritual_roots: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5-7 distinct short stanzas explaining spiritual themes." },
    scripture_anchors: { 
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          reference: { type: Type.STRING },
          text: { type: Type.STRING, description: "Short paraphrase or excerpt." }
        },
        required: ["reference", "text"]
      }
    },
    guided_prayer: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "A deep, extended prayer broken into 6-8 stanzas (approx 3 sentences each)." 
    },
    seven_day_program: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day_title: { type: Type.STRING, description: "e.g. 'Day 1: Notice & Name'" },
          activity: { type: Type.STRING, description: "1-2 sentence reflective activity." },
          listening_prompt: { type: Type.STRING, description: "Simple listening-to-Jesus prompt." },
          scripture_ref: { type: Type.STRING, description: "Short scripture reference." },
          declaration: { type: Type.STRING, description: "Simple declaration rooted in truth." }
        },
        required: ["day_title", "activity", "listening_prompt", "scripture_ref", "declaration"]
      },
      description: "A 7-day structured healing journey."
    },
    is_medical_warning: { type: Type.BOOLEAN, description: "Set to true if the symptom described could be a medical emergency, acute condition, or life-threatening issue requiring immediate professional attention." }
  },
  required: ["what_i_am_hearing", "body_connection", "emotional_roots", "spiritual_roots", "scripture_anchors", "guided_prayer", "seven_day_program", "is_medical_warning"]
};

export async function POST(request: Request) {
  try {
    // 1. Check authentication
    const authResult = await auth()
    const userId = authResult.userId
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Check subscription
    const hasFeature = authResult.has ? 
      await authResult.has({ feature: 'start_experience' }) : 
      false
    
    if (!hasFeature) {
      return NextResponse.json({ error: 'Subscription required' }, { status: 403 })
    }

    // 3. Get query from request body
    const { query } = await request.json()
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
    }

    // 4. Call Gemini API (server-side, key is secure)
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `The user is experiencing: "${query}". Provide a healing analysis based on Charles Wright's spiritual insights and Louise Hay's emotional patterns (Christian filter).` }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    const jsonText = response.text;
    
    if (!jsonText) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(jsonText);
    
    // 5. Return the result
    return NextResponse.json({ 
      success: true,
      data: parsed
    })

  } catch (error) {
    console.error('Generate Healing Error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate healing insights',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

