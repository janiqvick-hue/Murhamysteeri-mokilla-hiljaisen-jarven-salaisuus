import { useEffect, useRef } from 'react';
import { Settings } from '../types/game';

// Standardized Web Audio synthesizer for ambient environment sounds and effects.
// This requires NO external files, so it is 100% reliable, zero-weight, and immersive!
class AmbientAudioSynth {
  private ctx: AudioContext | null = null;
  private rainNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private windNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private rainGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;

  constructor() {
    // Initialized lazily upon first user interaction to satisfy browser policies
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

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
  }

  // Play synthetic feedback sound effects
  playClueDiscovered() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(440, this.ctx.currentTime); // A4
    osc1.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.3); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(220, this.ctx.currentTime); // A3
    osc2.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.3); // A4

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.5);
    osc2.stop(this.ctx.currentTime + 0.5);
  }

  playContradictionFound() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(293.66, this.ctx.currentTime); // D4
    osc.frequency.setValueAtTime(392.00, this.ctx.currentTime + 0.1); // G4
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime + 0.2); // D5

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.7);
  }

  playClick() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
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
