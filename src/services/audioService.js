import * as Tone from 'tone';

class AudioService {
  constructor() {
    this.isInitialized = false;
    this.synths = {};
    this.effects = {};
    this.samples = {};
    this.isPlaying = false;
    this.currentSequence = null;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await Tone.start();
      this.setupSynths();
      this.setupEffects();
      this.setupDrumSamples();
      this.isInitialized = true;
      console.log('Audio service initialized');
    } catch (error) {
      console.error('Failed to initialize audio service:', error);
    }
  }

  setupSynths() {
    // Main synthesizers
    this.synths.lead = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.8 },
      filter: { frequency: 1000, rolloff: -24 }
    });

    this.synths.bass = new Tone.MonoSynth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.5 },
      filter: { frequency: 300, rolloff: -12 }
    });

    this.synths.pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.5, decay: 0.3, sustain: 0.7, release: 2 }
    });

    this.synths.pluck = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.7
    });
  }

  setupEffects() {
    // Reverb
    this.effects.reverb = new Tone.Reverb({
      roomSize: 0.7,
      dampening: 3000
    });

    // Delay
    this.effects.delay = new Tone.PingPongDelay({
      delayTime: '8n',
      feedback: 0.3,
      wet: 0.2
    });

    // Filter
    this.effects.filter = new Tone.Filter({
      frequency: 1000,
      type: 'lowpass',
      rolloff: -24
    });

    // Distortion
    this.effects.distortion = new Tone.Distortion({
      distortion: 0.4,
      oversample: '4x'
    });

    // Connect effects
    this.synths.lead.connect(this.effects.reverb);
    this.synths.pad.connect(this.effects.reverb);
    this.synths.bass.connect(this.effects.filter);
    this.synths.pluck.connect(this.effects.delay);

    // Connect to master
    Object.values(this.effects).forEach(effect => {
      effect.toDestination();
    });

    Object.values(this.synths).forEach(synth => {
      if (!synth.output.connected) {
        synth.toDestination();
      }
    });
  }

  setupDrumSamples() {
    // Create basic drum sounds using oscillators
    this.samples.kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 10,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
    });

    this.samples.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.0 }
    });

    this.samples.hihat = new Tone.MetalSynth({
      frequency: 200,
      envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    });

    // Connect drums to destination
    this.samples.kick.toDestination();
    this.samples.snare.toDestination();
    this.samples.hihat.toDestination();
  }

  async playMidiPattern(pattern, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const { tempo = 120, loop = false, synthType = 'lead' } = options;
    
    // Set transport tempo
    Tone.Transport.bpm.value = tempo;

    // Stop any current playback
    this.stop();

    const synth = this.synths[synthType] || this.synths.lead;
    const events = [];

    // Convert pattern to Tone.js events
    if (pattern.chords) {
      pattern.chords.forEach(note => {
        events.push({
          time: note.time,
          note: note.note,
          duration: note.duration,
          velocity: note.velocity / 127
        });
      });
    }

    if (pattern.melody) {
      pattern.melody.forEach(note => {
        events.push({
          time: note.time,
          note: note.note,
          duration: note.duration,
          velocity: note.velocity / 127
        });
      });
    }

    if (pattern.bass) {
      const bassEvents = pattern.bass.map(note => ({
        time: note.time,
        note: note.note,
        duration: note.duration,
        velocity: note.velocity / 127
      }));
      
      this.currentSequence = new Tone.Part((time, event) => {
        this.synths.bass.triggerAttackRelease(
          event.note, 
          event.duration, 
          time, 
          event.velocity
        );
      }, bassEvents);
    }

    // Create main sequence
    if (events.length > 0) {
      this.currentSequence = new Tone.Part((time, event) => {
        synth.triggerAttackRelease(
          event.note, 
          event.duration, 
          time, 
          event.velocity
        );
      }, events);

      if (loop) {
        this.currentSequence.loop = true;
        this.currentSequence.loopEnd = '4m'; // 4 measures
      }

      this.currentSequence.start(0);
    }

    // Play drums if available
    if (pattern.drums) {
      this.playDrumPattern(pattern.drums, { loop });
    }

    Tone.Transport.start();
    this.isPlaying = true;
  }

  playDrumPattern(drumPattern, options = {}) {
    const { loop = false } = options;

    Object.keys(drumPattern).forEach(drumType => {
      const pattern = drumPattern[drumType];
      const sample = this.samples[drumType];

      if (sample && pattern) {
        const drumSequence = new Tone.Part((time, event) => {
          sample.triggerAttackRelease('C2', '32n', time, event.velocity / 127);
        }, pattern.map(hit => ({
          time: hit.time,
          velocity: hit.velocity
        })));

        if (loop) {
          drumSequence.loop = true;
          drumSequence.loopEnd = '1m'; // 1 measure
        }

        drumSequence.start(0);
      }
    });
  }

  stop() {
    if (this.currentSequence) {
      this.currentSequence.stop();
      this.currentSequence.dispose();
      this.currentSequence = null;
    }
    
    Tone.Transport.stop();
    Tone.Transport.cancel();
    this.isPlaying = false;
  }

  pause() {
    Tone.Transport.pause();
    this.isPlaying = false;
  }

  resume() {
    Tone.Transport.start();
    this.isPlaying = true;
  }

  generateWavSample(type, options = {}) {
    const {
      duration = 2,
      frequency = 440,
      sampleRate = 44100,
      bitDepth = 16
    } = options;

    return new Promise((resolve) => {
      const recorder = new Tone.Recorder();
      let source;

      switch (type) {
        case 'kick':
          source = this.samples.kick;
          break;
        case 'snare':
          source = this.samples.snare;
          break;
        case 'hihat':
          source = this.samples.hihat;
          break;
        case 'bass':
          source = this.synths.bass;
          break;
        case 'lead':
          source = this.synths.lead;
          break;
        default:
          source = this.synths.lead;
      }

      source.connect(recorder);
      recorder.start();

      // Trigger the sound
      if (type === 'kick' || type === 'snare' || type === 'hihat') {
        source.triggerAttackRelease('C2', duration);
      } else {
        source.triggerAttackRelease(frequency, duration);
      }

      setTimeout(async () => {
        const recording = await recorder.stop();
        const blob = new Blob([recording], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, duration * 1000 + 100);
    });
  }

  downloadWavSample(url, filename = 'sample.wav') {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  setTempo(bpm) {
    Tone.Transport.bpm.value = bpm;
  }

  setSynthParameter(synthType, parameter, value) {
    const synth = this.synths[synthType];
    if (synth && synth[parameter]) {
      synth[parameter].value = value;
    }
  }

  setEffectParameter(effectType, parameter, value) {
    const effect = this.effects[effectType];
    if (effect && effect[parameter]) {
      effect[parameter].value = value;
    }
  }

  // Methods for InteractiveGuidebook
  async playSample(audioData) {
    if (!audioData) return null;
    
    try {
      await Tone.start();
      
      const synth = new Tone.Synth().toDestination();
      const frequency = audioData.frequency || 440;
      const duration = audioData.duration || 1;
      
      synth.triggerAttackRelease(frequency, duration);
      
      return { 
        stop: () => synth.dispose(),
        duration: duration * 1000 
      };
    } catch (error) {
      console.error('Error playing sample:', error);
      return null;
    }
  }

  async exportSample(audioData) {
    if (!audioData) {
      throw new Error('Invalid audio data');
    }
    
    try {
      await Tone.start();
      
      const recorder = new Tone.Recorder();
      const synth = new Tone.Synth().connect(recorder);
      
      recorder.start();
      
      const frequency = audioData.frequency || 440;
      const duration = audioData.duration || 1;
      
      synth.triggerAttackRelease(frequency, duration);
      
      // Wait for recording to complete
      await new Promise(resolve => setTimeout(resolve, duration * 1000 + 100));
      
      const recording = await recorder.stop();
      synth.dispose();
      
      return new Blob([recording], { type: 'audio/wav' });
    } catch (error) {
      console.error('Error exporting sample:', error);
      throw error;
    }
  }

  async generateDrumLoop(options = {}) {
    const { genre, tempo, duration, includeKick, includeSnare, includeHihat } = options;
    
    // Return mock drum loop data
    return {
      type: 'drum-loop',
      genre,
      tempo,
      duration,
      frequency: 60, // Kick frequency
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.5 },
      effects: { compression: 0.7 }
    };
  }

  async generateSample(options = {}) {
    const { type, genre, duration } = options;
    
    const frequencies = {
      kick: 60,
      snare: 200,
      'hi-hat': 8000,
      bass: 80,
      lead: 440,
      pad: 220,
      pluck: 880
    };
    
    return {
      type,
      genre,
      duration: duration || 1,
      frequency: frequencies[type] || 440,
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.5 },
      effects: {}
    };
  }
}

export default new AudioService();