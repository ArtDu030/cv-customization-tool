import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    const { systemPrompt, userPrompt, apiKey, language } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    if (!apiKey.startsWith('sk-ant-')) {
      return NextResponse.json({ error: 'Invalid API key format' }, { status: 400 });
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from Claude API');
    }

    let customizedCV;
    try {
      // Clean the response text by removing markdown code blocks if present
      let cleanedText = content.text.trim();
      
      // Remove markdown code blocks (```json ... ```)
      if (cleanedText.startsWith('```json') && cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(7, -3).trim();
      } else if (cleanedText.startsWith('```') && cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(3, -3).trim();
      }
      
      customizedCV = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', content.text);
      throw new Error('Invalid JSON response from Claude API');
    }

    return NextResponse.json({ customizedCV });
  } catch (error: any) {
    console.error('Claude API error:', error);
    
    if (error.status === 401) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }
    
    if (error.status === 429) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    return NextResponse.json(
      { error: error.message || 'Failed to process CV customization' },
      { status: 500 }
    );
  }
}