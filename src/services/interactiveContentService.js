import midiService from './midiService.js';
import audioService from './audioService.js';

class InteractiveContentService {
  async generateInteractiveGuidebook(guidebookText, projectData) {
    // For now, return mock interactive content
    // In production, this would parse the guidebook text and generate appropriate content
    return this.generateMockInteractiveContent(projectData);
  }
  
  parseGuidebookSections(text) {
    const sections = [];
    
    // Enhanced chord progression detection
    const chordPatterns = [
      /chord progression[s]?[:\-\s]*(.*?)(?=\n|$)/gi,
      /harmonic progression[s]?[:\-\s]*(.*?)(?=\n|$)/gi,
      /chord[s]?[:\-\s]*(.*?)(?=\n|$)/gi,
      /(I-V-vi-IV|vi-IV-I-V|ii-V-I|i-bVII-bVI-bVII)/gi
    ];
    
    chordPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match, index) => {
          sections.push({
            type: 'chord-progression',
            title: `Chord Progression ${sections.filter(s => s.type === 'chord-progression').length + 1}`,
            description: match.trim(),
            position: text.indexOf(match)
          });
        });
      }
    });
    
    // Enhanced bass line detection
    const bassPatterns = [
      /bass line[s]?[:\-\s]*(.*?)(?=\n|$)/gi,
      /bassline[s]?[:\-\s]*(.*?)(?=\n|$)/gi,
      /sub bass[:\-\s]*(.*?)(?=\n|$)/gi,
      /808[s]?[:\-\s]*(.*?)(?=\n|$)/gi
    ];
    
    bassPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match, index) => {
          sections.push({
            type: 'bass-line',
            title: `Bass Pattern ${sections.filter(s => s.type === 'bass-line').length + 1}`,
            description: match.trim(),
            position: text.indexOf(match)
          });
        });
      }
    });
    
    // Enhanced melody detection
    const melodyPatterns = [
      /melody[:\-\s]*(.*?)(?=\n|$)/gi,
      /lead[:\-\s]*(.*?)(?=\n|$)/gi,
      /arpeggio[s]?[:\-\s]*(.*?)(?=\n|$)/gi,
      /sequence[s]?[:\-\s]*(.*?)(?=\n|$)/gi,
      /motif[s]?[:\-\s]*(.*?)(?=\n|$)/gi
    ];
    
    melodyPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match, index) => {
          sections.push({
            type: 'lead-melody',
            title: `Melody ${sections.filter(s => s.type === 'lead-melody').length + 1}`,
            description: match.trim(),
            position: text.indexOf(match)
          });
        });
      }
    });
    
    // Enhanced drum pattern detection
    const drumPatterns = [
      /drum pattern[s]?[:\-\s]*(.*?)(?=\n|$)/gi,
      /beat[s]?[:\-\s]*(.*?)(?=\n|$)/gi,
      /rhythm[s]?[:\-\s]*(.*?)(?=\n|$)/gi,
      /groove[s]?[:\-\s]*(.*?)(?=\n|$)/gi
    ];
    
    drumPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match, index) => {
          sections.push({
            type: 'drum-pattern',
            title: `Drum Pattern ${sections.filter(s => s.type === 'drum-pattern').length + 1}`,
            description: match.trim(),
            position: text.indexOf(match)
          });
        });
      }
    });
    
    // Enhanced sample detection with more types
    const samplePatterns = [
      /(kick|snare|hi-hat|hihat|clap|crash|ride|tom|cymbal|shaker|tambourine|cowbell|conga|bongo)[s]?[:\-\s]*(.*?)(?=\n|$)/gi,
      /(pad|string|brass|lead|pluck|stab|sweep|riser|impact|whoosh|vocal|choir)[s]?[:\-\s]*(.*?)(?=\n|$)/gi,
      /(fx|effect|reverb|delay|distortion|filter|phaser|flanger)[s]?[:\-\s]*(.*?)(?=\n|$)/gi
    ];
    
    samplePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match, index) => {
          const sampleType = match.match(/(kick|snare|hi-hat|hihat|clap|crash|ride|tom|cymbal|shaker|tambourine|cowbell|conga|bongo|pad|string|brass|lead|pluck|stab|sweep|riser|impact|whoosh|vocal|choir|fx|effect)/i)[1];
          sections.push({
            type: 'sample-suggestion',
            sampleType: sampleType.toLowerCase(),
            title: `${sampleType.charAt(0).toUpperCase() + sampleType.slice(1)} Sample`,
            description: match.trim(),
            position: text.indexOf(match)
          });
        });
      }
    });
    
    // Arpeggio detection
    const arpeggioMatches = text.match(/arpeggio[s]?[:\-\s]*(.*?)(?=\n|$)/gi);
    if (arpeggioMatches) {
      arpeggioMatches.forEach((match, index) => {
        sections.push({
          type: 'arpeggio',
          title: `Arpeggio Pattern ${index + 1}`,
          description: match.trim(),
          position: text.indexOf(match)
        });
      });
    }
    
    // Pad/atmosphere detection
    const padMatches = text.match(/(pad|atmosphere|ambient|texture)[s]?[:\-\s]*(.*?)(?=\n|$)/gi);
    if (padMatches) {
      padMatches.forEach((match, index) => {
        sections.push({
          type: 'pad',
          title: `Atmospheric Pad ${index + 1}`,
          description: match.trim(),
          position: text.indexOf(match)
        });
      });
    }
    
    return sections.sort((a, b) => a.position - b.position);
  }
  
  async generateChordProgressionMidi(section, projectData) {
    const key = projectData.key || 'C';
    const tempo = projectData.tempo || 120;
    const genre = projectData.genre?.[0] || 'House';
    
    // Generate chord progression based on genre and key
    const chordProgression = this.getChordProgressionForGenre(genre, key);
    
    return midiService.generateChordPattern({
      key,
      tempo,
      chordProgression,
      duration: 8, // 8 bars
      style: genre
    });
  }
  
  async generateBassLineMidi(section, projectData) {
    const key = projectData.key || 'C';
    const tempo = projectData.tempo || 120;
    const genre = projectData.genre?.[0] || 'House';
    
    return midiService.generateBassPattern({
      key,
      tempo,
      style: genre,
      duration: 4 // 4 bars
    });
  }
  
  async generateLeadMelodyMidi(section, projectData) {
    const key = projectData.key || 'C';
    const tempo = projectData.tempo || 120;
    const genre = projectData.genre?.[0] || 'House';
    
    return midiService.generateMelodyPattern({
      key,
      tempo,
      style: genre,
      duration: 4 // 4 bars
    });
  }
  
  async generateDrumSample(section, projectData) {
    const genre = projectData.genre?.[0] || 'House';
    const tempo = projectData.tempo || 120;
    
    // Generate a drum loop sample
    return audioService.generateDrumLoop({
      genre,
      tempo,
      duration: 2, // 2 bars
      includeKick: true,
      includeSnare: true,
      includeHihat: true
    });
  }
  
  async generateSampleForSuggestion(section, projectData) {
    const sampleType = section.sampleType || 'kick';
    const genre = projectData.genre?.[0] || 'House';
    
    return audioService.generateSample({
      type: sampleType,
      genre,
      duration: sampleType === 'kick' || sampleType === 'snare' ? 0.5 : 1.0
    });
  }
  
  getChordProgressionForGenre(genre, key) {
    const progressions = {
      'House': ['I', 'vi', 'IV', 'V'],
      'Techno': ['i', 'bVII', 'bVI', 'bVII'],
      'Trance': ['vi', 'IV', 'I', 'V'],
      'Dubstep': ['i', 'bVI', 'bIII', 'bVII'],
      'Future Bass': ['I', 'V', 'vi', 'IV'],
      'Ambient': ['I', 'iii', 'vi', 'IV'],
      'Hip Hop': ['i', 'bVII', 'i', 'bVII'],
      'Pop': ['I', 'V', 'vi', 'IV']
    };
    
    return progressions[genre] || progressions['House'];
  }
  
  // Enhanced mock data for demonstration
  generateMockInteractiveContent(projectData) {
    const genre = projectData.genre?.[0] || 'House';
    const key = projectData.key || 'C Major';
    const tempo = projectData.tempo || 120;
    
    const elements = [
      // Chord Progression
      {
        id: 'chord-demo-1',
        type: 'midi',
        title: `${genre} Chord Progression`,
        description: `A classic ${genre} chord progression in ${key}`,
        midiData: this.generateChordProgressionForGenre(genre, key, tempo),
        position: 0
      },
      
      // Bass Line
      {
        id: 'bass-demo-1',
        type: 'midi',
        title: `${genre} Bass Line`,
        description: `A driving bass line that complements the chord progression`,
        midiData: this.generateBassLineForGenre(genre, key, tempo),
        position: 1
      },
      
      // Lead Melody
      {
        id: 'lead-demo-1',
        type: 'midi',
        title: `${genre} Lead Melody`,
        description: `An uplifting lead melody for the chorus section`,
        midiData: this.generateMelodyForGenre(genre, key, tempo),
        position: 2
      },
      
      // Arpeggio
      {
        id: 'arp-demo-1',
        type: 'midi',
        title: `${genre} Arpeggio`,
        description: `A rhythmic arpeggio pattern to add movement`,
        midiData: this.generateArpeggioForGenre(genre, key, tempo),
        position: 3
      },
      
      // Kick Drum
      {
        id: 'kick-demo-1',
        type: 'sample',
        title: `${genre} Kick Drum`,
        description: `A punchy kick drum perfect for ${genre} tracks`,
        audioData: this.generateSampleForType('kick', genre),
        position: 4
      },
      
      // Snare
      {
        id: 'snare-demo-1',
        type: 'sample',
        title: `${genre} Snare`,
        description: `A crisp snare with the right punch for ${genre}`,
        audioData: this.generateSampleForType('snare', genre),
        position: 5
      },
      
      // Hi-Hat
      {
        id: 'hihat-demo-1',
        type: 'sample',
        title: `${genre} Hi-Hat`,
        description: `Tight hi-hats to drive the rhythm`,
        audioData: this.generateSampleForType('hihat', genre),
        position: 6
      },
      
      // Pad
      {
        id: 'pad-demo-1',
        type: 'sample',
        title: `${genre} Atmospheric Pad`,
        description: `Lush pad sounds to fill the background`,
        audioData: this.generateSampleForType('pad', genre),
        position: 7
      },
      
      // Pluck
      {
        id: 'pluck-demo-1',
        type: 'sample',
        title: `${genre} Pluck`,
        description: `Sharp pluck sounds for rhythmic elements`,
        audioData: this.generateSampleForType('pluck', genre),
        position: 8
      }
    ];
    
    // Filter elements based on genre relevance
    return this.filterElementsByGenre(elements, genre);
  }
  
  generateChordProgressionForGenre(genre, key, tempo) {
    const progressions = {
      'House': [
        { note: 'C4', time: 0, duration: 1, velocity: 80 },
        { note: 'E4', time: 0, duration: 1, velocity: 80 },
        { note: 'G4', time: 0, duration: 1, velocity: 80 },
        { note: 'A3', time: 1, duration: 1, velocity: 80 },
        { note: 'C4', time: 1, duration: 1, velocity: 80 },
        { note: 'E4', time: 1, duration: 1, velocity: 80 },
        { note: 'F3', time: 2, duration: 1, velocity: 80 },
        { note: 'A3', time: 2, duration: 1, velocity: 80 },
        { note: 'C4', time: 2, duration: 1, velocity: 80 },
        { note: 'G3', time: 3, duration: 1, velocity: 80 },
        { note: 'B3', time: 3, duration: 1, velocity: 80 },
        { note: 'D4', time: 3, duration: 1, velocity: 80 }
      ],
      'Techno': [
        { note: 'A3', time: 0, duration: 2, velocity: 90 },
        { note: 'C4', time: 0, duration: 2, velocity: 90 },
        { note: 'E4', time: 0, duration: 2, velocity: 90 },
        { note: 'G3', time: 2, duration: 2, velocity: 90 },
        { note: 'Bb3', time: 2, duration: 2, velocity: 90 },
        { note: 'D4', time: 2, duration: 2, velocity: 90 }
      ],
      'Dubstep': [
        { note: 'E3', time: 0, duration: 0.5, velocity: 100 },
        { note: 'G3', time: 0, duration: 0.5, velocity: 100 },
        { note: 'B3', time: 0, duration: 0.5, velocity: 100 },
        { note: 'C4', time: 1, duration: 0.5, velocity: 100 },
        { note: 'E4', time: 1, duration: 0.5, velocity: 100 },
        { note: 'G4', time: 1, duration: 0.5, velocity: 100 },
        { note: 'D3', time: 2, duration: 0.5, velocity: 100 },
        { note: 'F#3', time: 2, duration: 0.5, velocity: 100 },
        { note: 'A3', time: 2, duration: 0.5, velocity: 100 },
        { note: 'G3', time: 3, duration: 0.5, velocity: 100 },
        { note: 'B3', time: 3, duration: 0.5, velocity: 100 },
        { note: 'D4', time: 3, duration: 0.5, velocity: 100 }
      ]
    };
    
    const notes = progressions[genre] || progressions['House'];
    return { notes, tempo, duration: 4, key };
  }
  
  generateBassLineForGenre(genre, key, tempo) {
    const bassLines = {
      'House': [
        { note: 'C2', time: 0, duration: 0.5, velocity: 100 },
        { note: 'C2', time: 0.5, duration: 0.5, velocity: 80 },
        { note: 'A1', time: 1, duration: 0.5, velocity: 100 },
        { note: 'A1', time: 1.5, duration: 0.5, velocity: 80 },
        { note: 'F1', time: 2, duration: 0.5, velocity: 100 },
        { note: 'F1', time: 2.5, duration: 0.5, velocity: 80 },
        { note: 'G1', time: 3, duration: 0.5, velocity: 100 },
        { note: 'G1', time: 3.5, duration: 0.5, velocity: 80 }
      ],
      'Techno': [
        { note: 'A1', time: 0, duration: 0.25, velocity: 110 },
        { note: 'A1', time: 0.5, duration: 0.25, velocity: 90 },
        { note: 'A1', time: 1, duration: 0.25, velocity: 110 },
        { note: 'A1', time: 1.5, duration: 0.25, velocity: 90 },
        { note: 'G1', time: 2, duration: 0.25, velocity: 110 },
        { note: 'G1', time: 2.5, duration: 0.25, velocity: 90 },
        { note: 'G1', time: 3, duration: 0.25, velocity: 110 },
        { note: 'G1', time: 3.5, duration: 0.25, velocity: 90 }
      ],
      'Dubstep': [
        { note: 'E1', time: 0, duration: 0.125, velocity: 127 },
        { note: 'E1', time: 0.25, duration: 0.125, velocity: 100 },
        { note: 'E1', time: 0.75, duration: 0.125, velocity: 127 },
        { note: 'C1', time: 1, duration: 0.125, velocity: 127 },
        { note: 'C1', time: 1.25, duration: 0.125, velocity: 100 },
        { note: 'C1', time: 1.75, duration: 0.125, velocity: 127 },
        { note: 'D1', time: 2, duration: 0.125, velocity: 127 },
        { note: 'D1', time: 2.5, duration: 0.125, velocity: 100 },
        { note: 'G1', time: 3, duration: 0.125, velocity: 127 },
        { note: 'G1', time: 3.5, duration: 0.125, velocity: 100 }
      ]
    };
    
    const notes = bassLines[genre] || bassLines['House'];
    return { notes, tempo, duration: 4, key };
  }
  
  generateMelodyForGenre(genre, key, tempo) {
    const melodies = {
      'House': [
        { note: 'C5', time: 0, duration: 0.25, velocity: 90 },
        { note: 'D5', time: 0.25, duration: 0.25, velocity: 85 },
        { note: 'E5', time: 0.5, duration: 0.5, velocity: 95 },
        { note: 'G5', time: 1, duration: 0.5, velocity: 90 },
        { note: 'F5', time: 1.5, duration: 0.25, velocity: 85 },
        { note: 'E5', time: 1.75, duration: 0.25, velocity: 80 },
        { note: 'D5', time: 2, duration: 1, velocity: 90 },
        { note: 'C5', time: 3, duration: 1, velocity: 95 }
      ],
      'Techno': [
        { note: 'A4', time: 0, duration: 0.5, velocity: 95 },
        { note: 'C5', time: 0.5, duration: 0.5, velocity: 90 },
        { note: 'E5', time: 1, duration: 0.5, velocity: 95 },
        { note: 'G5', time: 1.5, duration: 0.5, velocity: 90 },
        { note: 'F5', time: 2, duration: 0.5, velocity: 95 },
        { note: 'D5', time: 2.5, duration: 0.5, velocity: 90 },
        { note: 'Bb4', time: 3, duration: 1, velocity: 100 }
      ],
      'Dubstep': [
        { note: 'E5', time: 0, duration: 0.125, velocity: 100 },
        { note: 'G5', time: 0.125, duration: 0.125, velocity: 95 },
        { note: 'B5', time: 0.25, duration: 0.25, velocity: 110 },
        { note: 'C6', time: 0.75, duration: 0.25, velocity: 105 },
        { note: 'B5', time: 1, duration: 0.125, velocity: 100 },
        { note: 'G5', time: 1.125, duration: 0.125, velocity: 95 },
        { note: 'E5', time: 1.25, duration: 0.75, velocity: 110 },
        { note: 'D5', time: 2, duration: 0.5, velocity: 100 },
        { note: 'G5', time: 2.5, duration: 1.5, velocity: 115 }
      ]
    };
    
    const notes = melodies[genre] || melodies['House'];
    return { notes, tempo, duration: 4, key };
  }
  
  generateArpeggioForGenre(genre, key, tempo) {
    const arpeggios = {
      'House': [
        { note: 'C4', time: 0, duration: 0.25, velocity: 75 },
        { note: 'E4', time: 0.25, duration: 0.25, velocity: 75 },
        { note: 'G4', time: 0.5, duration: 0.25, velocity: 75 },
        { note: 'C5', time: 0.75, duration: 0.25, velocity: 75 },
        { note: 'A3', time: 1, duration: 0.25, velocity: 75 },
        { note: 'C4', time: 1.25, duration: 0.25, velocity: 75 },
        { note: 'E4', time: 1.5, duration: 0.25, velocity: 75 },
        { note: 'A4', time: 1.75, duration: 0.25, velocity: 75 },
        { note: 'F3', time: 2, duration: 0.25, velocity: 75 },
        { note: 'A3', time: 2.25, duration: 0.25, velocity: 75 },
        { note: 'C4', time: 2.5, duration: 0.25, velocity: 75 },
        { note: 'F4', time: 2.75, duration: 0.25, velocity: 75 },
        { note: 'G3', time: 3, duration: 0.25, velocity: 75 },
        { note: 'B3', time: 3.25, duration: 0.25, velocity: 75 },
        { note: 'D4', time: 3.5, duration: 0.25, velocity: 75 },
        { note: 'G4', time: 3.75, duration: 0.25, velocity: 75 }
      ],
      'Techno': [
        { note: 'A3', time: 0, duration: 0.125, velocity: 80 },
        { note: 'C4', time: 0.125, duration: 0.125, velocity: 80 },
        { note: 'E4', time: 0.25, duration: 0.125, velocity: 80 },
        { note: 'A4', time: 0.375, duration: 0.125, velocity: 80 },
        { note: 'C5', time: 0.5, duration: 0.125, velocity: 80 },
        { note: 'A4', time: 0.625, duration: 0.125, velocity: 80 },
        { note: 'E4', time: 0.75, duration: 0.125, velocity: 80 },
        { note: 'C4', time: 0.875, duration: 0.125, velocity: 80 }
      ]
    };
    
    const notes = arpeggios[genre] || arpeggios['House'];
    return { notes, tempo, duration: 4, key };
  }
  
  generateSampleForType(type, genre) {
    const sampleData = {
      kick: {
        'House': { frequency: 60, duration: 0.8, envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.5 } },
        'Techno': { frequency: 55, duration: 1.0, envelope: { attack: 0.005, decay: 0.4, sustain: 0.05, release: 0.6 } },
        'Dubstep': { frequency: 45, duration: 1.2, envelope: { attack: 0.02, decay: 0.5, sustain: 0.2, release: 0.8 } }
      },
      snare: {
        'House': { frequency: 200, duration: 0.3, envelope: { attack: 0.01, decay: 0.1, sustain: 0.05, release: 0.2 } },
        'Techno': { frequency: 220, duration: 0.25, envelope: { attack: 0.005, decay: 0.08, sustain: 0.02, release: 0.15 } },
        'Dubstep': { frequency: 180, duration: 0.4, envelope: { attack: 0.02, decay: 0.15, sustain: 0.1, release: 0.3 } }
      },
      hihat: {
        'House': { frequency: 8000, duration: 0.1, envelope: { attack: 0.001, decay: 0.05, sustain: 0.01, release: 0.05 } },
        'Techno': { frequency: 9000, duration: 0.08, envelope: { attack: 0.001, decay: 0.04, sustain: 0.005, release: 0.04 } },
        'Dubstep': { frequency: 7000, duration: 0.12, envelope: { attack: 0.002, decay: 0.06, sustain: 0.02, release: 0.08 } }
      },
      pad: {
        'House': { frequency: 220, duration: 4.0, envelope: { attack: 0.5, decay: 1.0, sustain: 0.7, release: 2.0 } },
        'Techno': { frequency: 200, duration: 4.0, envelope: { attack: 0.3, decay: 0.8, sustain: 0.6, release: 1.5 } },
        'Dubstep': { frequency: 180, duration: 4.0, envelope: { attack: 0.8, decay: 1.5, sustain: 0.8, release: 3.0 } }
      },
      pluck: {
        'House': { frequency: 440, duration: 0.5, envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 } },
        'Techno': { frequency: 480, duration: 0.4, envelope: { attack: 0.005, decay: 0.15, sustain: 0.05, release: 0.25 } },
        'Dubstep': { frequency: 400, duration: 0.6, envelope: { attack: 0.02, decay: 0.25, sustain: 0.15, release: 0.4 } }
      }
    };
    
    const genreData = sampleData[type]?.[genre] || sampleData[type]?.['House'] || sampleData[type];
    return {
      type,
      genre,
      ...genreData,
      effects: { compression: 0.7, reverb: 0.2 }
    };
  }
  
  filterElementsByGenre(elements, genre) {
    // Return different numbers of elements based on genre complexity
    const genreComplexity = {
      'House': 6,
      'Techno': 7,
      'Dubstep': 8,
      'Trance': 6,
      'Ambient': 4,
      'Hip Hop': 5
    };
    
    const maxElements = genreComplexity[genre] || 6;
    return elements.slice(0, maxElements);
  }
}

export default new InteractiveContentService();