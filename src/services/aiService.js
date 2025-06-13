import { GoogleGenerativeAI } from '@google/generative-ai';

// For demo purposes, we'll use a placeholder API key
// In production, this should be set via environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'demo-key';

class AIService {
  constructor() {
    if (API_KEY !== 'demo-key') {
      this.genAI = new GoogleGenerativeAI(API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    } else {
      console.warn('Using demo mode - AI features will return mock data');
      this.genAI = null;
      this.model = null;
    }
  }

  async generateGuidebook(inputs) {
    if (!this.model) {
      return this.getMockGuidebook(inputs);
    }

    const prompt = this.buildGuidebookPrompt(inputs);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating guidebook:', error);
      return this.getMockGuidebook(inputs);
    }
  }

  async generateMidiSuggestions(inputs) {
    if (!this.model) {
      return this.getMockMidiSuggestions(inputs);
    }

    const prompt = this.buildMidiPrompt(inputs);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return this.parseMidiSuggestions(response.text());
    } catch (error) {
      console.error('Error generating MIDI suggestions:', error);
      return this.getMockMidiSuggestions(inputs);
    }
  }

  buildGuidebookPrompt(inputs) {
    const { genre, vibe, artistReference, daw, plugins, instruments } = inputs;
    
    return `Create a comprehensive music production guidebook for:
    
Genre: ${genre.join(', ') || 'Not specified'}
Vibe: ${vibe.join(', ') || 'Not specified'}
Artist Reference: ${artistReference || 'General style'}
DAW: ${daw || 'Any DAW'}
Available Plugins: ${plugins || 'Standard plugins'}
Instruments: ${instruments || 'Standard instruments'}

Please provide a detailed guide covering:
1. Song Structure & Arrangement
2. Sound Design & Synthesis
3. Mixing Techniques
4. Recommended Plugins & Settings
5. Chord Progressions & Harmony
6. Rhythm & Groove Patterns
7. Production Tips & Tricks
8. Reference Tracks for Inspiration

Format the response in clear sections with practical, actionable advice.`;
  }

  buildMidiPrompt(inputs) {
    const { genre, key, tempo, chordProgression } = inputs;
    
    return `Generate MIDI composition suggestions for:
    
Genre: ${genre}
Key: ${key}
Tempo: ${tempo} BPM
Chord Progression: ${chordProgression}

Provide specific MIDI patterns for:
1. Main chord progression (with exact notes and timing)
2. Bass line pattern
3. Lead melody ideas
4. Drum pattern (kick, snare, hi-hat patterns)
5. Arpeggiated sequences
6. Pad/atmosphere parts

Include note names, octaves, velocities, and timing information.`;
  }

  parseMidiSuggestions(text) {
    // Parse AI response into structured MIDI data
    // This would need more sophisticated parsing in production
    return {
      chords: this.extractChordPattern(text),
      bass: this.extractBassPattern(text),
      melody: this.extractMelodyPattern(text),
      drums: this.extractDrumPattern(text)
    };
  }

  extractChordPattern(text) {
    // Mock implementation - would parse actual chord data from AI response
    return [
      { note: 'C4', time: 0, duration: 1, velocity: 80 },
      { note: 'E4', time: 0, duration: 1, velocity: 80 },
      { note: 'G4', time: 0, duration: 1, velocity: 80 },
    ];
  }

  extractBassPattern(text) {
    return [
      { note: 'C2', time: 0, duration: 0.5, velocity: 100 },
      { note: 'C2', time: 0.5, duration: 0.5, velocity: 80 },
    ];
  }

  extractMelodyPattern(text) {
    return [
      { note: 'C5', time: 0, duration: 0.25, velocity: 90 },
      { note: 'D5', time: 0.25, duration: 0.25, velocity: 85 },
      { note: 'E5', time: 0.5, duration: 0.5, velocity: 95 },
    ];
  }

  extractDrumPattern(text) {
    return {
      kick: [{ time: 0, velocity: 127 }, { time: 0.5, velocity: 100 }],
      snare: [{ time: 0.25, velocity: 110 }, { time: 0.75, velocity: 105 }],
      hihat: [{ time: 0, velocity: 80 }, { time: 0.125, velocity: 60 }, { time: 0.25, velocity: 80 }]
    };
  }

  getMockGuidebook(inputs) {
    const genre = inputs.genre?.[0] || 'Electronic';
    
    return `# ${genre} Production Guide

## Song Structure
- **Intro**: 8-16 bars with atmospheric elements
- **Verse**: Main groove with minimal elements
- **Chorus**: Full arrangement with lead elements
- **Bridge**: Breakdown or variation section
- **Outro**: Gradual fade or hard stop

## Sound Design
- **Synthesis**: Use subtractive synthesis for bass, FM for leads
- **Effects**: Reverb for space, delay for rhythm, distortion for character
- **Layering**: Combine multiple sounds for richness

## Mixing Tips
- **EQ**: High-pass non-bass elements, boost presence frequencies
- **Compression**: Control dynamics, add punch to drums
- **Stereo Width**: Use panning and stereo effects for space

## Recommended Plugins
- **Synthesizers**: Serum, Massive X, Operator
- **Effects**: FabFilter Pro-Q, Valhalla VintageVerb, Soundtoys
- **Drums**: Battery, Addictive Drums, samples

## Chord Progressions
- **Popular**: vi-IV-I-V (Am-F-C-G in C major)
- **Alternative**: i-bVII-bVI-bVII (Am-G-F-G)
- **Jazz**: ii-V-I (Dm-G-C)

## Production Tips
1. Start with a strong drum pattern
2. Build around a central musical idea
3. Use reference tracks for comparison
4. Leave space in the mix
5. Automate for movement and interest

## Reference Artists
Listen to and analyze tracks by genre leaders for inspiration and technique study.`;
  }

  getMockMidiSuggestions(inputs) {
    return {
      chords: [
        { note: 'C4', time: 0, duration: 1, velocity: 80 },
        { note: 'E4', time: 0, duration: 1, velocity: 80 },
        { note: 'G4', time: 0, duration: 1, velocity: 80 },
        { note: 'F4', time: 1, duration: 1, velocity: 80 },
        { note: 'A4', time: 1, duration: 1, velocity: 80 },
        { note: 'C5', time: 1, duration: 1, velocity: 80 },
      ],
      bass: [
        { note: 'C2', time: 0, duration: 0.5, velocity: 100 },
        { note: 'C2', time: 0.5, duration: 0.5, velocity: 80 },
        { note: 'F2', time: 1, duration: 0.5, velocity: 100 },
        { note: 'F2', time: 1.5, duration: 0.5, velocity: 80 },
      ],
      melody: [
        { note: 'C5', time: 0, duration: 0.25, velocity: 90 },
        { note: 'D5', time: 0.25, duration: 0.25, velocity: 85 },
        { note: 'E5', time: 0.5, duration: 0.5, velocity: 95 },
        { note: 'G5', time: 1, duration: 0.5, velocity: 90 },
      ],
      drums: {
        kick: [{ time: 0, velocity: 127 }, { time: 0.5, velocity: 100 }, { time: 1, velocity: 127 }],
        snare: [{ time: 0.25, velocity: 110 }, { time: 0.75, velocity: 105 }, { time: 1.25, velocity: 110 }],
        hihat: [
          { time: 0, velocity: 80 }, { time: 0.125, velocity: 60 }, 
          { time: 0.25, velocity: 80 }, { time: 0.375, velocity: 60 },
          { time: 0.5, velocity: 80 }, { time: 0.625, velocity: 60 }
        ]
      }
    };
  }
}

export default new AIService();