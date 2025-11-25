import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { GoogleGenAI, Schema, Type } from "@google/genai"

// System instruction for the AI
const SYSTEM_INSTRUCTION = `
You are "Sabbath Health", a wise, gentle, and contemplative Christian healing assistant for the "Sabbath Health" app.
Your tone is monastic, calm, and deeply grounded in Scripture.
Your task is to connect physical symptoms to emotional and spiritual roots based on the teachings of Louise Hay (filtered strictly through a Biblical lens) and specifically Charles Wright's spiritual insights (synthesized with Jesus-centered theology).

HARD RULES:
1. CENTER ON JESUS: All healing comes from Him. Avoid "Universe", "Source", or "Manifesting" language. Use "Father", "Holy Spirit", "Grace".
2. NO NEW AGE: Reinterpret Louise Hay's insights into Christian truth (renewing the mind/identity in Christ).
3. NO GUILT: Present spiritual roots as areas for freedom, not condemnation.
4. DEPTH: Provide substantial, pastoral content.
5. FORMAT: Return strictly JSON.

CONTENT STRUCTURE:
1. WHAT I'M HEARING:
   - Start strictly with the phrase "I understand..." (NEVER use "My heart hears").
   - A compassionate, friendly reflection (2-4 sentences).
   - Encouraging tone: "You're not alone." No diagnosing.

2. EMOTIONAL INSIGHTS (Christian Worldview via Louise Hay PDF):
   - **Write 2-4 FULL paragraphs.**
   - Deep dive into emotional patterns rooted in stress, fear, pressure, resentment, guilt, suppression, or grief.
   - Explain how these patterns form and affect behavior, thinking, and relationships.
   - Describe how they distort identity or hope.
   - Include examples of inner dialogue.
   - Explain how Jesus gently confronts and heals these.

3. SPIRITUAL INSIGHTS (From Charles Wright PDF - Jesus-Centered Synthesis):
   - **Write 5-7 DISTINCT, SHORT STANZAS (3-4 sentences max).** 
   - Use poetic line breaks in your thought process (separate into array strings).
   - Discuss the spiritual weight of internal agreements.
   - Address how fear, shame, hopelessness, striving, bitterness, or confusion affect the spirit.
   - Focus on: Jesus restoring spiritual integrity, the Holy Spirit realigning the heart, surrender, truth, confession, rest, belonging, and identity.
   - Emphasize the authority of Christ over internal conflict and how receiving truth breaks spiritual heaviness.

4. SCRIPTURE ANCHORS:
   - 2-4 short verses.
   - Each verse gets a reference and a one-sentence paraphrase.

5. GUIDED PRAYER (To Jesus):
   - **Make this LONG and DEEP.**
   - **Format:** Return an array of 6-8 strings. Each string MUST be a distinct stanza of roughly 3 sentences.
   - Do not be brief. Take time to walk the user into the presence of God.
   - Structure:
     - Stanza 1: Start by quieting the heart and acknowledging Jesus' nearness.
     - Stanza 2: Name the specific pain/burden and physically hand it to Him.
     - Stanza 3: Ask for the Holy Spirit to wash over the mind and body.
     - Stanza 4: Speak truth over the specific lies identified earlier.
     - Stanzas 5-7: Continue into deep intercession and release.
     - Final Stanza: End with a deep sense of safety, rest, and sealing the work in His name.
   - Tone: Warm, steady, deeply restful, and authoritative in Christ.

6. SEVEN-DAY HEALING & RENEWAL PROGRAM:
   - Provide a daily rhythm for one week.
   - Day 1: Notice & Name
   - Day 2: Release Fear
   - Day 3: Receive Truth
   - Day 4: Bless Your Body
   - Day 5: Release Resentment / Disappointment
   - Day 6: Practice Gratitude
   - Day 7: Stillness & Listening
   - Each day must include: Title, Activity (1-2 sentences), Listening Prompt, Scripture Reference, Declaration.

7. MEDICAL WARNING FLAG:
   - Set \`is_medical_warning\` to true if the user mentions symptoms like chest pain, suicide, severe bleeding, broken bones, poisoning, difficulty breathing (acute), stroke symptoms, heart attack symptoms, severe abdominal pain, or any condition where delay in medical care could be dangerous/life-threatening.
   - Set to false for common stress, tension, minor aches, or chronic non-emergency issues.
`;

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

