import * as Tone from 'tone';

class AudioService {
  constructor() {
    this.isInitialized = false;
    this.synths = {};
    this.effects = {};
    this.samples = {};
    this.isPlaying = false;
    this.currentSequence = null;
    this.activeVoices = [];
    this.activeSamples = [];
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
      throw new Error('Audio initialization failed. Please check browser permissions.');
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
    
    // Connect synths to master output
    Object.values(this.synths).forEach(synth => {
      synth.toDestination();
    });
  }

  setupEffects() {
    // Reverb
    this.effects.reverb = new Tone.Reverb({
      roomSize: 0.7,
      dampening: 3000
    }).toDestination();

    // Delay
    this.effects.delay = new Tone.PingPongDelay({
      delayTime: '8n',
      feedback: 0.3,
      wet: 0.2
    }).toDestination();

    // Filter
    this.effects.filter = new Tone.Filter({
      frequency: 1000,
      type: 'lowpass',
      rolloff: -24
    }).toDestination();

    // Distortion
    this.effects.distortion = new Tone.Distortion({
      distortion: 0.4,
      oversample: '4x'
    }).toDestination();

    // Connect synths to effects
    this.synths.lead.connect(this.effects.reverb);
    this.synths.pad.connect(this.effects.delay);
    this.synths.bass.connect(this.effects.filter);
    this.synths.pluck.connect(this.effects.delay);
  }

  setupDrumSamples() {
    this.samples.kick = new Tone.Player({
      url: "/samples/kick.wav",
      onload: () => console.log("Kick sample loaded")
    }).toDestination();
    
    this.samples.snare = new Tone.Player({
      url: "/samples/snare.wav",
      onload: () => console.log("Snare sample loaded")
    }).toDestination();
    
    this.samples.hihat = new Tone.Player({
      url: "/samples/hihat.wav",
      onload: () => console.log("Hi-hat sample loaded")
    }).toDestination();
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

  playMidiSequence(midiData, tempo = 120) {
    if (!this.isInitialized) {
      console.error('Audio service not initialized');
      return;
    }
    
    this.stop(); // Stop any currently playing sequence
    
    Tone.Transport.bpm.value = tempo;
    
    const sequence = new Tone.Sequence((time, note) => {
      if (!note) return;
      
      const { pitch, duration, velocity, instrument } = note;
      const synth = this.synths[instrument] || this.synths.lead;
      
      // Play the note
      synth.triggerAttackRelease(
        Tone.Frequency(pitch).toFrequency(), 
        duration, 
        time, 
        velocity / 127
      );
      
      // Track active voices for proper cleanup
      this.activeVoices.push({ synth, pitch, time: Tone.now() });
      
    }, midiData, '16n');
    
    this.currentSequence = sequence;
    sequence.start(0);
    Tone.Transport.start();
    this.isPlaying = true;
    
    return true;
  }

  stop() {
    if (this.currentSequence) {
      this.currentSequence.stop();
      this.currentSequence.dispose();
      this.currentSequence = null;
    }
    
    // Release all active voices
    this.activeVoices.forEach(voice => {
      voice.synth.triggerRelease(voice.pitch);
    });
    this.activeVoices = [];
    
    // Stop all active samples
    this.activeSamples.forEach(sample => {
      sample.stop();
    });
    this.activeSamples = [];
    
    Tone.Transport.stop();
    this.isPlaying = false;
    
    return true;
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
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    // Create an offline context for rendering audio
    const duration = options.duration || 2;
    const sampleRate = options.sampleRate || 44100;
    
    const offlineContext = new Tone.OfflineContext(
      duration, 
      sampleRate
    );
    
    // Create appropriate synth based on sample type
    let synth;
    switch (type) {
      case 'kick':
        synth = new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 5,
          oscillator: { type: 'sine' },
          envelope: {
            attack: 0.001,
            decay: 0.4,
            sustain: 0.01,
            release: 1.4,
            attackCurve: 'exponential'
          }
        }).toDestination();
        synth.triggerAttackRelease('C1', 0.3, 0);
        break;
        
      case 'snare':
        synth = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: {
            attack: 0.001,
            decay: 0.2,
            sustain: 0.02,
            release: 0.5
          }
        }).toDestination();
        synth.triggerAttackRelease(0.1, 0);
        break;
        
      case 'hihat':
        synth = new Tone.MetalSynth({
          frequency: 200,
          envelope: {
            attack: 0.001,
            decay: 0.1,
            release: 0.01
          },
          harmonicity: 5.1,
          modulationIndex: 32,
          resonance: 4000,
          octaves: 1.5
        }).toDestination();
        synth.triggerAttackRelease('C6', 0.05, 0);
        break;
        
      case 'bass':
        synth = new Tone.MonoSynth({
          oscillator: { type: 'square' },
          envelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.3,
            release: 0.8
          },
          filterEnvelope: {
            attack: 0.01,
            decay: 0.3,
            sustain: 0.5,
            release: 0.5,
            baseFrequency: 200,
            octaves: 2.5
          }
        }).toDestination();
        synth.triggerAttackRelease('C2', 1, 0);
        break;
        
      case 'lead':
        synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sawtooth' },
          envelope: {
            attack: 0.1,
            decay: 0.2,
            sustain: 0.5,
            release: 0.8
          }
        }).toDestination();
        synth.triggerAttackRelease(['C4', 'E4', 'G4'], 1, 0);
        break;
        
      case 'pad':
        synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: {
            attack: 0.5,
            decay: 0.3,
            sustain: 0.7,
            release: 2
          }
        }).toDestination();
        synth.triggerAttackRelease(['C3', 'E3', 'G3', 'B3'], 2, 0);
        break;
        
      default:
        throw new Error(`Unknown sample type: ${type}`);
    }
    
    // Apply effects if specified
    if (options.effects) {
      if (options.effects.reverb) {
        const reverb = new Tone.Reverb({
          decay: options.effects.reverb.decay || 1.5,
          wet: options.effects.reverb.wet || 0.5
        }).toDestination();
        synth.connect(reverb);
      }
      
      if (options.effects.delay) {
        const delay = new Tone.PingPongDelay({
          delayTime: options.effects.delay.time || 0.25,
          feedback: options.effects.delay.feedback || 0.3,
          wet: options.effects.delay.wet || 0.2
        }).toDestination();
        synth.connect(delay);
      }
    }
    
    // Render audio to buffer
    const buffer = await offlineContext.render();
    
    // Convert to WAV
    const wavBlob = this._bufferToWav(buffer, {
      float32: true,
      bitDepth: 32
    });
    
    return {
      blob: wavBlob,
      url: URL.createObjectURL(wavBlob),
      type: type,
      duration: duration
    };
  }

  _bufferToWav(buffer, options = {}) {
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = options.float32 ? 3 : 1;
    const bitDepth = options.bitDepth || 16;
    
    let result;
    if (format === 3) {
      result = new Float32Array(buffer.length * numberOfChannels);
    } else {
      result = new Int16Array(buffer.length * numberOfChannels);
    }
    
    // Interleave channels
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < buffer.length; i++) {
        result[(i * numberOfChannels) + channel] = 
          format === 3 ? channelData[i] : channelData[i] * 32767;
      }
    }
    
    // Create WAV file
    const dataSize = result.length * (bitDepth / 8);
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    
    // WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * (bitDepth / 8), true);
    view.setUint16(32, numberOfChannels * (bitDepth / 8), true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);
    
    // Write audio data
    if (format === 3) {
      for (let i = 0; i < result.length; i++) {
        view.setFloat32(44 + (i * 4), result[i], true);
      }
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setInt16(44 + (i * 2), result[i], true);
      }
    }
    
    function writeString(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
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