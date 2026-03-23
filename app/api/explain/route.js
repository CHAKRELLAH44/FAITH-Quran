import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const {
      surahNumber,
      englishName,
      arabicName,
      translation,
      systemPrompt,
      userPrompt,
    } = await req.json()

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: systemPrompt || 'Tu es un expert en sciences islamiques. Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.',
          },
          {
            role: 'user',
            content: userPrompt || `Génère une explication structurée en français pour la sourate ${surahNumber} "${englishName}" (${arabicName} - ${translation}).
Réponds UNIQUEMENT avec ce JSON :
{
  "context": "Contexte de révélation en 3-4 phrases",
  "theme": "Thème principal en 2-3 phrases",
  "message": "Message clé en 3-4 phrases",
  "key_verse_arabic": "Un verset représentatif en arabe",
  "key_verse_translation": "Traduction du verset",
  "virtue": "Vertu ou bienfait de cette sourate"
}`,
          },
        ],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Groq API error:', err)
      return NextResponse.json({ error: true, message: err }, { status: res.status })
    }

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const info = JSON.parse(clean)

    return NextResponse.json(info)

  } catch (err) {
    console.error('Route error:', err)
    return NextResponse.json({ error: true, message: err.message }, { status: 500 })
  }
}