import MidiWriter from 'midi-writer-js';

class MidiService {
  constructor() {
    this.track = new MidiWriter.Track();
  }

  generateMidiFile(patterns, options = {}) {
    const {
      tempo = 120,
      timeSignature = [4, 4],
      key = 'C',
      trackName = 'Generated Track'
    } = options;

    // Create a new track
    const track = new MidiWriter.Track();
    
    // Set track properties
    track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
    track.addEvent(new MidiWriter.TimeSignatureEvent(timeSignature[0], timeSignature[1]));
    track.addEvent(new MidiWriter.KeySignatureEvent(key, 'major'));
    track.addEvent(new MidiWriter.TempoEvent({ bpm: tempo }));
    track.addEvent(new MidiWriter.TrackNameEvent({ text: trackName }));

    // Add chord progression
    if (patterns.chords && patterns.chords.length > 0) {
      this.addChordsToTrack(track, patterns.chords);
    }

    // Add bass line
    if (patterns.bass && patterns.bass.length > 0) {
      this.addBassToTrack(track, patterns.bass);
    }

    // Add melody
    if (patterns.melody && patterns.melody.length > 0) {
      this.addMelodyToTrack(track, patterns.melody);
    }

    // Create the MIDI file
    const write = new MidiWriter.Writer(track);
    return write.dataUri();
  }

  addChordsToTrack(track, chords) {
    // Group chords by timing
    const chordGroups = this.groupNotesByTime(chords);
    
    Object.keys(chordGroups).forEach(time => {
      const chordNotes = chordGroups[time];
      const pitches = chordNotes.map(note => note.note);
      const duration = chordNotes[0].duration || '4'; // Default quarter note
      const velocity = chordNotes[0].velocity || 80;
      
      track.addEvent(new MidiWriter.NoteEvent({
        pitch: pitches,
        duration: this.convertDurationToMidi(duration),
        velocity: velocity,
        startTick: this.convertTimeToTicks(parseFloat(time))
      }));
    });
  }

  addBassToTrack(track, bassNotes) {
    bassNotes.forEach(note => {
      track.addEvent(new MidiWriter.NoteEvent({
        pitch: note.note,
        duration: this.convertDurationToMidi(note.duration || 0.5),
        velocity: note.velocity || 100,
        startTick: this.convertTimeToTicks(note.time)
      }));
    });
  }

  addMelodyToTrack(track, melodyNotes) {
    melodyNotes.forEach(note => {
      track.addEvent(new MidiWriter.NoteEvent({
        pitch: note.note,
        duration: this.convertDurationToMidi(note.duration || 0.25),
        velocity: note.velocity || 90,
        startTick: this.convertTimeToTicks(note.time)
      }));
    });
  }

  generateDrumMidi(drumPatterns, options = {}) {
    const { tempo = 120, bars = 4 } = options;
    
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 128 })); // Drum kit
    track.addEvent(new MidiWriter.TempoEvent({ bpm: tempo }));
    track.addEvent(new MidiWriter.TrackNameEvent({ text: 'Drums' }));

    // Standard drum mapping
    const drumMap = {
      kick: 36,    // C2
      snare: 38,   // D2
      hihat: 42,   // F#2
      openhat: 46, // A#2
      crash: 49,   // C#3
      ride: 51     // D#3
    };

    // Add drum patterns
    Object.keys(drumPatterns).forEach(drumType => {
      if (drumMap[drumType]) {
        const pattern = drumPatterns[drumType];
        pattern.forEach(hit => {
          track.addEvent(new MidiWriter.NoteEvent({
            pitch: drumMap[drumType],
            duration: '8',
            velocity: hit.velocity || 100,
            startTick: this.convertTimeToTicks(hit.time)
          }));
        });
      }
    });

    const write = new MidiWriter.Writer(track);
    return write.dataUri();
  }

  groupNotesByTime(notes) {
    return notes.reduce((groups, note) => {
      const time = note.time.toString();
      if (!groups[time]) {
        groups[time] = [];
      }
      groups[time].push(note);
      return groups;
    }, {});
  }

  convertDurationToMidi(duration) {
    // Convert decimal duration to MIDI duration string
    if (duration >= 1) return '4';      // Quarter note
    if (duration >= 0.5) return '8';    // Eighth note
    if (duration >= 0.25) return '16';  // Sixteenth note
    return '32';                        // Thirty-second note
  }

  convertTimeToTicks(time) {
    // Convert time in beats to MIDI ticks (assuming 480 ticks per quarter note)
    return Math.round(time * 480);
  }

  generateChordProgression(key, progression, options = {}) {
    const { octave = 4, duration = 1, velocity = 80 } = options;
    
    // Basic chord mappings for major keys
    const chordMappings = {
      'I': [0, 4, 7],
      'ii': [2, 5, 9],
      'iii': [4, 7, 11],
      'IV': [5, 9, 0],
      'V': [7, 11, 2],
      'vi': [9, 0, 4],
      'vii°': [11, 2, 5]
    };

    const keyOffsets = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4,
      'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9,
      'A#': 10, 'Bb': 10, 'B': 11
    };

    const keyOffset = keyOffsets[key] || 0;
    const chords = [];

    progression.forEach((chord, index) => {
      const chordTones = chordMappings[chord];
      if (chordTones) {
        chordTones.forEach(tone => {
          const midiNote = 60 + keyOffset + tone + (octave - 4) * 12; // C4 = 60
          chords.push({
            note: this.midiNoteToName(midiNote),
            time: index * duration,
            duration: duration,
            velocity: velocity
          });
        });
      }
    });

    return chords;
  }

  midiNoteToName(midiNote) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const note = noteNames[midiNote % 12];
    return `${note}${octave}`;
  }

  downloadMidi(dataUri, filename = 'generated-track.mid') {
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Methods for InteractiveGuidebook
  async playMidiData(midiData) {
    if (!midiData || !midiData.notes) return null;
    
    try {
      await Tone.start();
      
      const synth = new Tone.PolySynth().toDestination();
      const now = Tone.now();
      
      midiData.notes.forEach(note => {
        synth.triggerAttackRelease(
          note.note, 
          note.duration || 0.5, 
          now + (note.time || 0),
          (note.velocity || 80) / 127
        );
      });
      
      return { stop: () => synth.dispose() };
    } catch (error) {
      console.error('Error playing MIDI data:', error);
      return null;
    }
  }

  async exportMidiData(midiData) {
    if (!midiData || !midiData.notes) {
      throw new Error('Invalid MIDI data');
    }
    
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
    
    // Convert notes to MIDI events
    const events = midiData.notes.map(note => {
      const pitch = this.noteToPitch(note.note);
      return new MidiWriter.NoteEvent({
        pitch: [pitch],
        duration: this.durationToTicks(note.duration || 0.5),
        velocity: note.velocity || 80,
        startTick: this.timeToTicks(note.time || 0)
      });
    });
    
    events.forEach(event => track.addEvent(event));
    
    const write = new MidiWriter.Writer(track);
    const midiData64 = write.dataUri();
    const byteCharacters = atob(midiData64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    return new Blob([new Uint8Array(byteNumbers)], { type: 'audio/midi' });
  }

  noteToPitch(noteString) {
    const noteMap = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4,
      'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9,
      'A#': 10, 'Bb': 10, 'B': 11
    };
    
    const match = noteString.match(/([A-G][#b]?)(\d+)/);
    if (!match) return 60; // Default to C4
    
    const [, note, octave] = match;
    return (parseInt(octave) + 1) * 12 + noteMap[note];
  }

  durationToTicks(duration) {
    return Math.round(duration * 480); // 480 ticks per quarter note
  }

  timeToTicks(time) {
    return Math.round(time * 480);
  }
}

export default new MidiService();