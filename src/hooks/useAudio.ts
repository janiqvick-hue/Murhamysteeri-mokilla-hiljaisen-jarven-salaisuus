import { useEffect, useRef } from 'react';
import { Settings } from '../types/game';

// Standardized Web Audio synthesizer for ambient environment sounds, music, and effects.
// This requires NO external files, so it is 100% reliable, zero-weight, and immersive!
class AmbientAudioSynth {
  private ctx: AudioContext | null = null;
  private rainNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private windNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private rainGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;

  // Cinematic main menu music components
  private droneOscs: OscillatorNode[] = [];
  private droneGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private menuMusicGain: GainNode | null = null;
  private isMenuMusicActive: boolean = false;
  private pianoTimeout: any = null;
  private thunderTimeout: any = null;

  constructor() {
    // Initialized lazily upon first user interaction to satisfy browser policies
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    
    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Menu Music Gain
    this.menuMusicGain = this.ctx.createGain();
    this.menuMusicGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    this.menuMusicGain.connect(this.masterGain);

    this.createWindGenerator();
    this.createRainGenerator();
  }

  // Generate pink/white noise for wind using a ScriptProcessorNode (highly compatible)
  private createWindGenerator() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = 4096;
    // ScriptProcessor is deprecated but universally supported and perfect for lightweight synthesis fallback
    const node = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    let lastOut = 0.0;

    node.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // First-order lowpass filter to approximate brownian/pink noise for wind
        lastOut = 0.98 * lastOut + 0.02 * white;
        output[i] = lastOut;
      }
    };

    // Filter to make it sound like wind howling
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    // Create a slow LFO to modulate the wind pitch (howling effect)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // very slow

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime); // modulate up to 150Hz

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency); // modulate lowpass cutoff frequency

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.0, this.ctx.currentTime); // silent by default

    node.connect(filter);
    filter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    lfo.start();
    this.windNode = node;
  }

  // Create rain sounds using high-passed white noise
  private createRainGenerator() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = 4096;
    const node = this.ctx.createScriptProcessor(bufferSize, 1, 1);

    node.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    };

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.0, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    node.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    this.rainNode = node;
  }

  setVolume(musicOn: boolean, soundOn: boolean) {
    this.init();
    if (!this.ctx || !this.masterGain || !this.windGain || !this.rainGain) return;

    // Resume context if suspended
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const targetWindGain = musicOn ? 0.25 : 0.0;
    const targetRainGain = musicOn ? 0.12 : 0.0;

    const t = this.ctx.currentTime;
    this.windGain.gain.linearRampToValueAtTime(targetWindGain, t + 1.5);
    this.rainGain.gain.linearRampToValueAtTime(targetRainGain, t + 1.5);
    this.isPlaying = musicOn;

    // Handle active menu music volume based on settings
    if (this.menuMusicGain) {
      const targetMenuMusicGain = musicOn && this.isMenuMusicActive ? 0.25 : 0.0;
      this.menuMusicGain.gain.cancelScheduledValues(t);
      this.menuMusicGain.gain.linearRampToValueAtTime(targetMenuMusicGain, t + 1.5);
    }
  }

  // === 1. START CINEMATIC MENU MUSIC ===
  startMainMenuMusic() {
    this.init();
    if (!this.ctx || !this.menuMusicGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isMenuMusicActive) return;
    this.isMenuMusicActive = true;

    const t = this.ctx.currentTime;
    
    // Smoothly fade in main menu music gain
    this.menuMusicGain.gain.cancelScheduledValues(t);
    this.menuMusicGain.gain.setValueAtTime(0.0, t);
    this.menuMusicGain.gain.linearRampToValueAtTime(0.25, t + 2.0); // 25% target volume

    // Play some wind and rain underneath too
    if (this.windGain) {
      this.windGain.gain.cancelScheduledValues(t);
      this.windGain.gain.linearRampToValueAtTime(0.2, t + 2.0);
    }
    if (this.rainGain) {
      this.rainGain.gain.cancelScheduledValues(t);
      this.rainGain.gain.linearRampToValueAtTime(0.08, t + 2.0);
    }

    // Start matalat jouset (deep string drone)
    this.startDrone();

    // Start hiljainen piano (sparse random notes)
    this.schedulePianoNote();
  }

  // Deep Cello/Double Bass style string section synthesis
  private startDrone() {
    if (!this.ctx || !this.menuMusicGain) return;
    this.stopDrone();

    const t = this.ctx.currentTime;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.0, t);
    this.droneGain.gain.linearRampToValueAtTime(0.45, t + 4.0); // slow string rise

    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(110, t);
    this.droneFilter.Q.setValueAtTime(1.8, t);

    // Deep detuned minor frequencies: A1 = 55Hz, E2 = 82.4Hz, A2 = 110Hz
    const freqs = [55.00, 82.41, 110.00];
    this.droneOscs = freqs.map((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      // Triangle has softer harmonics, sawtooth gives bowed grit
      osc.type = idx === 1 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      
      // detune slightly for lush/mysterious chorus effect
      const detuneCents = (idx - 1) * 4; // -4, 0, +4 cents
      osc.detune.setValueAtTime(detuneCents, t);

      const oscGain = this.ctx!.createGain();
      const baseGain = idx === 0 ? 0.35 : idx === 1 ? 0.45 : 0.2;
      oscGain.gain.setValueAtTime(baseGain, t);

      osc.connect(oscGain);
      oscGain.connect(this.droneFilter!);
      osc.start(t);
      return osc;
    });

    this.droneFilter.connect(this.droneGain);
    this.droneGain.connect(this.menuMusicGain);

    // Bowing motion: slowly modulate filter frequency
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, t); // 12 seconds per wave
    lfoGain.gain.setValueAtTime(35, t);

    lfo.connect(lfoGain);
    lfoGain.connect(this.droneFilter.frequency);
    lfo.start(t);
    this.droneOscs.push(lfo);
  }

  private stopDrone() {
    this.droneOscs.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {}
    });
    this.droneOscs = [];

    if (this.droneGain) {
      try {
        this.droneGain.disconnect();
      } catch (e) {}
      this.droneGain = null;
    }
    if (this.droneFilter) {
      try {
        this.droneFilter.disconnect();
      } catch (e) {}
      this.droneFilter = null;
    }
  }

  // Sparse piano keys generator (A-minor dark scale)
  private schedulePianoNote() {
    if (!this.isMenuMusicActive) return;

    const nextDelayMs = 4000 + Math.random() * 5000; // random 4-9 seconds
    this.pianoTimeout = setTimeout(() => {
      this.playPianoNote();
      this.schedulePianoNote();
    }, nextDelayMs);
  }

  private playPianoNote() {
    if (!this.ctx || !this.menuMusicGain || !this.isMenuMusicActive) return;

    const t = this.ctx.currentTime;
    // Elegant minor tones in higher/mid registers
    const scale = [220.00, 261.63, 329.63, 440.00, 493.88, 523.25, 659.25];
    const freq = scale[Math.floor(Math.random() * scale.length)];

    const pianoOsc = this.ctx.createOscillator();
    const pianoGain = this.ctx.createGain();
    const hammerOsc = this.ctx.createOscillator();
    const hammerGain = this.ctx.createGain();

    pianoOsc.type = 'triangle';
    pianoOsc.frequency.setValueAtTime(freq, t);

    // Warm decay tone
    pianoGain.gain.setValueAtTime(0.0, t);
    pianoGain.gain.linearRampToValueAtTime(0.16, t + 0.02); // soft strike attack
    pianoGain.gain.exponentialRampToValueAtTime(0.001, t + 4.5); // long resonance ring

    // High frequency hammer strike chime
    hammerOsc.type = 'sine';
    hammerOsc.frequency.setValueAtTime(freq * 3, t); // 3rd harmonic
    hammerGain.gain.setValueAtTime(0.05, t);
    hammerGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); // short click strike

    pianoOsc.connect(pianoGain);
    hammerOsc.connect(hammerGain);

    pianoGain.connect(this.menuMusicGain);
    hammerGain.connect(this.menuMusicGain);

    pianoOsc.start(t);
    hammerOsc.start(t);

    pianoOsc.stop(t + 4.8);
    hammerOsc.stop(t + 0.1);
  }

  triggerDynamicThunder() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const type = Math.floor(Math.random() * 3); // 0, 1, or 2

    const thunderFilter = this.ctx.createBiquadFilter();
    thunderFilter.type = 'lowpass';
    
    // Distant thunder has muffled high frequencies due to air absorption, so lowpass is perfect!
    let filterFreq = 75;
    let duration = 8.0;
    let Q_val = 1.5;

    // Pick a random peak volume between 25% and 35% as requested:
    const peakVolume = 0.25 + Math.random() * 0.10;

    // Muffled brown noise synthesis
    const bufferSize = 4096 * 4;
    const node = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    let rumble = 0.0;
    node.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        rumble = 0.993 * rumble + 0.007 * white;
        output[i] = rumble;
      }
    };

    const thunderGain = this.ctx.createGain();
    thunderGain.gain.setValueAtTime(0, t);

    if (type === 0) {
      // Type A: Deep Muffled Rumble (Very low frequency, long and slow build-up)
      filterFreq = 50 + Math.random() * 15; // 50Hz - 65Hz
      duration = 8.0 + Math.random() * 3.0; // 8-11s
      Q_val = 1.2;

      thunderGain.gain.linearRampToValueAtTime(peakVolume * 0.7, t + 1.8); // slow build-up
      thunderGain.gain.linearRampToValueAtTime(peakVolume * 0.5, t + 3.5);
      thunderGain.gain.linearRampToValueAtTime(peakVolume * 0.6, t + 5.0);
      thunderGain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    } else if (type === 1) {
      // Type B: Sudden Double-Clap Crackle (Slightly higher frequency, fast attack)
      filterFreq = 85 + Math.random() * 25; // 85Hz - 110Hz
      duration = 6.0 + Math.random() * 2.0; // 6-8s
      Q_val = 2.0;

      thunderGain.gain.linearRampToValueAtTime(peakVolume, t + 0.15); // sudden sharp crack
      thunderGain.gain.linearRampToValueAtTime(peakVolume * 0.3, t + 0.5); // brief drop
      thunderGain.gain.linearRampToValueAtTime(peakVolume * 0.7, t + 1.2); // secondary clap
      thunderGain.gain.linearRampToValueAtTime(peakVolume * 0.2, t + 3.0);
      thunderGain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    } else {
      // Type C: Rolling Multi-Peak Storm (Three waves in rolling sequence)
      filterFreq = 68 + Math.random() * 14; // 68Hz - 82Hz
      duration = 7.5 + Math.random() * 2.5; // 7.5-10s
      Q_val = 1.6;

      thunderGain.gain.linearRampToValueAtTime(peakVolume * 0.8, t + 0.4); // first rolling peak
      thunderGain.gain.linearRampToValueAtTime(peakVolume * 0.3, t + 1.2); 
      thunderGain.gain.linearRampToValueAtTime(peakVolume * 0.9, t + 2.2); // second louder rolling peak
      thunderGain.gain.linearRampToValueAtTime(peakVolume * 0.4, t + 3.5); 
      thunderGain.gain.linearRampToValueAtTime(peakVolume * 0.6, t + 4.8); // third rolling peak
      thunderGain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    }

    thunderFilter.frequency.setValueAtTime(filterFreq, t);
    thunderFilter.Q.setValueAtTime(Q_val, t);

    node.connect(thunderFilter);
    thunderFilter.connect(thunderGain);
    thunderGain.connect(this.masterGain);

    setTimeout(() => {
      try {
        node.disconnect();
        thunderFilter.disconnect();
        thunderGain.disconnect();
      } catch (e) {}
    }, duration * 1000 + 1000);
  }

  // === 2. FADE OUT MENU MUSIC ===
  fadeAndStopMainMenuMusic() {
    if (!this.ctx || !this.menuMusicGain || !this.isMenuMusicActive) return;

    this.isMenuMusicActive = false;
    clearTimeout(this.pianoTimeout);
    clearTimeout(this.thunderTimeout);

    const t = this.ctx.currentTime;
    this.menuMusicGain.gain.cancelScheduledValues(t);
    this.menuMusicGain.gain.linearRampToValueAtTime(0.001, t + 1.0); // 1.0s fade out as requested

    setTimeout(() => {
      this.stopDrone();
    }, 1100);
  }

  stopMainMenuMusic() {
    this.isMenuMusicActive = false;
    clearTimeout(this.pianoTimeout);
    clearTimeout(this.thunderTimeout);
    this.stopDrone();
    if (this.menuMusicGain) {
      try {
        this.menuMusicGain.gain.setValueAtTime(0.0, this.ctx?.currentTime || 0);
      } catch (e) {}
    }
  }

  // === 3. TRANSITION CINEMATIC SOUNDS ===
  playTransitionSound() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    
    // A: Heavy wooden step thud (muffled wooden floor)
    const stepOsc = this.ctx.createOscillator();
    const stepGain = this.ctx.createGain();
    const stepFilter = this.ctx.createBiquadFilter();
    
    stepOsc.type = 'triangle';
    stepOsc.frequency.setValueAtTime(95, t);
    stepOsc.frequency.exponentialRampToValueAtTime(25, t + 0.3);
    
    stepFilter.type = 'lowpass';
    stepFilter.frequency.setValueAtTime(110, t);
    
    stepGain.gain.setValueAtTime(0.38, t);
    stepGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    
    stepOsc.connect(stepFilter);
    stepFilter.connect(stepGain);
    stepGain.connect(this.masterGain);
    
    stepOsc.start(t);
    stepOsc.stop(t + 0.45);

    // B: Old wooden door creak (squeaking hinges friction)
    const creakOsc = this.ctx.createOscillator();
    const creakGain = this.ctx.createGain();
    const creakFilter = this.ctx.createBiquadFilter();

    creakOsc.type = 'sawtooth';
    creakOsc.frequency.setValueAtTime(165, t + 0.12);
    
    // Slow Sweep & vibration via 10Hz pitch LFO
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(11, t); // wood friction frequency
    lfoGain.gain.setValueAtTime(28, t);
    
    lfo.connect(lfoGain);
    lfoGain.connect(creakOsc.frequency);
    
    creakOsc.frequency.linearRampToValueAtTime(225, t + 0.95);
    
    creakFilter.type = 'bandpass';
    creakFilter.frequency.setValueAtTime(420, t);
    creakFilter.Q.setValueAtTime(5.5, t);
    
    creakGain.gain.setValueAtTime(0.0, t);
    creakGain.gain.linearRampToValueAtTime(0.08, t + 0.25);
    creakGain.gain.linearRampToValueAtTime(0.05, t + 0.65);
    creakGain.gain.exponentialRampToValueAtTime(0.001, t + 1.15);
    
    creakOsc.connect(creakFilter);
    creakFilter.connect(creakGain);
    creakGain.connect(this.masterGain);
    
    lfo.start(t);
    creakOsc.start(t + 0.12);
    lfo.stop(t + 1.25);
    creakOsc.stop(t + 1.25);
  }

  // Play realistic material-based audio feedback and atmospheric sounds
  playPaperRustle() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    const bufferSize = 2048;
    const node = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    };
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, t);
    filter.Q.setValueAtTime(1.8, t);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    // Double rustle envelope to sound natural
    gain.gain.linearRampToValueAtTime(0.04, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.005, t + 0.12);
    gain.gain.linearRampToValueAtTime(0.025, t + 0.14);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    
    node.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    setTimeout(() => {
      try {
        node.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch (e) {}
    }, 400);
  }

  playWoodCreak() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);
    
    // Low frequency friction modulator for squeaking wood fibers
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(16, t);
    lfoGain.gain.setValueAtTime(20, t);
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    osc.frequency.linearRampToValueAtTime(90, t + 0.18);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(210, t);
    filter.Q.setValueAtTime(2.8, t);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    lfo.start(t);
    osc.start(t);
    lfo.stop(t + 0.25);
    osc.stop(t + 0.25);
  }

  playMetalClink() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    // Damped metallic strike: overlapping detuned sine harmonics
    const freqs = [980, 1350, 1980, 2900];
    const gains = [0.025, 0.018, 0.012, 0.008];
    const decays = [0.14, 0.09, 0.06, 0.04];
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, t);
    filter.connect(this.masterGain);
    
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      
      oscGain.gain.setValueAtTime(0, t);
      oscGain.gain.linearRampToValueAtTime(gains[idx], t + 0.004);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + decays[idx]);
      
      osc.connect(oscGain);
      oscGain.connect(filter);
      
      osc.start(t);
      osc.stop(t + decays[idx] + 0.05);
    });
  }

  playFabricRustle() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    const bufferSize = 2048;
    const node = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    };
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(750, t);
    filter.Q.setValueAtTime(0.7, t);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.028, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    
    node.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    setTimeout(() => {
      try {
        node.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch (e) {}
    }, 300);
  }

  playInvestigationStinger() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    const freqs = [55.00, 82.41, 110.00, 164.81]; // Low E-minor/A-minor ambient swell
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, t);
    filter.connect(this.masterGain);
    
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      
      const baseGain = idx === 0 ? 0.08 : idx === 1 ? 0.06 : 0.03;
      oscGain.gain.setValueAtTime(0, t);
      oscGain.gain.linearRampToValueAtTime(baseGain, t + 0.08);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      
      osc.connect(oscGain);
      oscGain.connect(filter);
      
      osc.start(t);
      osc.stop(t + 1.3);
    });
  }

  // Play cinematic feedback sound effects
  playClueDiscovered() {
    // Replaced synthetic chime with the low investigation stinger
    this.playInvestigationStinger();
  }

  playContradictionFound() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    // Dark discordant low-frequency double drone for realizing a lie
    const freqs = [73.42, 77.78]; // D2 and D#2 (dissonant semitone cluster)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, t);
    filter.connect(this.masterGain);

    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      oscGain.gain.setValueAtTime(0, t);
      oscGain.gain.linearRampToValueAtTime(0.12, t + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start(t);
      osc.stop(t + 1.5);
    });
  }

  playClick() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    // Muted low wooden keyboard-like click
    osc.frequency.setValueAtTime(130, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(85, this.ctx.currentTime + 0.04);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
}

export const audioSynth = new AmbientAudioSynth();

export function useAudio(settings: Settings) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Avoid running on very first render unless triggered by state change
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    audioSynth.setVolume(settings.musicOn, settings.soundOn);
  }, [settings.musicOn, settings.soundOn]);

  const playClue = () => {
    if (settings.soundOn) {
      audioSynth.playClueDiscovered();
    }
  };

  const playContradiction = () => {
    if (settings.soundOn) {
      audioSynth.playContradictionFound();
    }
  };

  const playClick = () => {
    if (settings.soundOn) {
      audioSynth.playClick();
    }
  };

  return {
    playClue,
    playContradiction,
    playClick,
  };
}
