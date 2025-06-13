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
    }).toDestination();

    this.synths.bass = new Tone.MonoSynth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.5 },
      filter: { frequency: 300, rolloff: -12 }
    }).toDestination();

    this.synths.pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.5, decay: 0.3, sustain: 0.7, release: 2 }
    }).toDestination();

    this.synths.pluck = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.7
    }).toDestination();
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

    // Connect effects
    this.synths.lead.connect(this.effects.reverb);
  }
  
  setupDrumSamples() {
    // Initialize drum samples
    this.samples.kick = new Tone.Player({
      url: "/samples/kick.wav",
      onload: () => console.log("Kick sample loaded")
    }).toDestination();
    
    this.samples.snare = new Tone.Player({
      url: "/samples/snare.wav",
      onload: () => console.log("Snare sample loaded")
    }).toDestination();
  }
  
  playMidiSequence(midiData, tempo = 120) {
    if (!this.isInitialized) {
      console.error('Audio service not initialized');
      return false;
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
    
    Tone.Transport.stop();
    this.isPlaying = false;
    
    return true;
  }
  
  generateWavSample(type, options = {}) {
    if (!this.isInitialized) {
      // Don't use await outside async function
      this.initialize().then(() => {
        return this._generateWavSampleInternal(type, options);
      });
    } else {
      return this._generateWavSampleInternal(type, options);
    }
  }
  
  async _generateWavSampleInternal(type, options = {}) {
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
        
      default:
        synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease('C4', 0.5, 0);
    }
    
    // Render audio to buffer
    const buffer = await offlineContext.render();
    
    // Convert to WAV
    const wavBlob = this._bufferToWav(buffer);
    
    return {
      blob: wavBlob,
      url: URL.createObjectURL(wavBlob),
      type: type,
      duration: duration
    };
  }
  
  _bufferToWav(buffer) {
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM format
    const bitDepth = 16;
    
    const result = new Int16Array(buffer.length * numberOfChannels);
    
    // Interleave channels
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < buffer.length; i++) {
        result[(i * numberOfChannels) + channel] = channelData[i] * 32767;
      }
    }
    
    // Create WAV file
    const dataSize = result.length * 2;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    
    // WAV header
    this._writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    this._writeString(view, 8, 'WAVE');
    this._writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, bitDepth, true);
    this._writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);
    
    // Write audio data
    for (let i = 0; i < result.length; i++) {
      view.setInt16(44 + (i * 2), result[i], true);
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
  }
  
  _writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
  
  playSample(type) {
    if (!this.isInitialized) {
      console.error('Audio service not initialized');
      return false;
    }
    
    if (this.samples[type]) {
      this.samples[type].start();
      return true;
    }
    
    return false;
  }
}

export default new AudioService();