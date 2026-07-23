import { useEffect } from 'react';
import { Settings } from '../types/game';

export interface ThunderEvent {
  isClose: boolean;
  flashIntensity: number; // 0.0 - 1.0 (distant = dim, close/strike = bright)
  type: 'distant' | 'close' | 'strike';
  delayMs: number;
}

type ThunderListener = (event: ThunderEvent) => void;

// Centralized Audio Manager using real HTML5 Audio files for ambient weather (rain & thunder)
// and Web Audio API for UI sound effects and subtle menu music.
class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Track user audio settings
  private soundOn: boolean = true;
  private musicOn: boolean = true;

  // Rain HTML5 Audio Element
  private rainAudio: HTMLAudioElement | null = null;
  private isRainPlaying: boolean = false;
  private rainFadeInterval: any = null;

  // Thunder HTML5 Audio Files
  private thunderFiles = {
    distant: '/audio/ambient/soundreality-thunder-sound-375727.mp3',
    close: '/audio/ambient/freesound_community-thunder-big-crack-explosive-close-ms-77mel-190903-62202.mp3',
    strike: '/audio/ambient/universfield-loud-thunder-192165.mp3',
  };

  // Thunder Cycle Manager
  private thunderTimeout: any = null;
  private isThunderCycleRunning: boolean = false;
  private onThunderCallback: ((isClose: boolean) => void) | null = null;
  private thunderListeners: Set<ThunderListener> = new Set();

  // Main menu music components (subtle drone & piano notes)
  private droneOscs: OscillatorNode[] = [];
  private droneGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private menuMusicGain: GainNode | null = null;
  private isMenuMusicActive: boolean = false;
  private pianoTimeout: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.initAndStart();
      };
      ['click', 'touchstart', 'keydown', 'pointerdown'].forEach((evt) => {
        window.addEventListener(evt, unlock, { passive: true });
      });
      try {
        this.initAndStart();
      } catch (e) {}
    }
  }

  public setOnThunderCallback(cb: ((isClose: boolean) => void) | null) {
    this.onThunderCallback = cb;
  }

  public addThunderListener(listener: ThunderListener): () => void {
    this.thunderListeners.add(listener);
    return () => {
      this.thunderListeners.delete(listener);
    };
  }

  private notifyThunder(event: ThunderEvent) {
    if (this.onThunderCallback) {
      try {
        this.onThunderCallback(event.isClose);
      } catch (e) {}
    }
    this.thunderListeners.forEach((fn) => {
      try {
        fn(event);
      } catch (e) {}
    });
  }

  public initAndStart() {
    this.initWebAudio();
    this.startRainAudio();
    this.startThunderCycle();
  }

  private initWebAudio() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Master Gain for UI SFX and Menu Music
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Menu Music Gain
    this.menuMusicGain = this.ctx.createGain();
    this.menuMusicGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    this.menuMusicGain.connect(this.masterGain);
  }

  // === RAIN AUDIO IMPLEMENTATION (REAL MP3 LOOP WITH 1S FADE-IN) ===
  public startRainAudio() {
    if (typeof window === 'undefined') return;

    if (!this.rainAudio) {
      this.rainAudio = new Audio('/audio/ambient/dragon-studio-gentle-rain-07-437321.mp3');
      this.rainAudio.loop = true;
      this.rainAudio.onerror = (e) => {
        console.warn('Rain audio error:', e);
      };
    }

    if (!this.soundOn) {
      this.rainAudio.volume = 0.0;
      if (!this.rainAudio.paused) {
        this.rainAudio.pause();
      }
      this.isRainPlaying = false;
      return;
    }

    const targetVol = 0.20; // 20% volume as specified

    if (!this.isRainPlaying || this.rainAudio.paused) {
      this.rainAudio.volume = 0.0;
      this.rainAudio.play().then(() => {
        this.isRainPlaying = true;
        this.fadeRainVolume(targetVol, 1000);
      }).catch(() => {
        // Handled gracefully if blocked prior to user interaction
      });
    } else {
      this.fadeRainVolume(targetVol, 1000);
    }
  }

  private fadeRainVolume(targetVolume: number, durationMs: number = 1000) {
    if (!this.rainAudio) return;
    if (this.rainFadeInterval) {
      clearInterval(this.rainFadeInterval);
      this.rainFadeInterval = null;
    }

    const startVolume = this.rainAudio.volume;
    const steps = 20;
    const stepTime = durationMs / steps;
    let step = 0;

    this.rainFadeInterval = setInterval(() => {
      step++;
      const progress = step / steps;
      if (this.rainAudio) {
        this.rainAudio.volume = Math.max(0, Math.min(1, startVolume + (targetVolume - startVolume) * progress));
      }
      if (step >= steps) {
        if (this.rainFadeInterval) {
          clearInterval(this.rainFadeInterval);
          this.rainFadeInterval = null;
        }
        if (this.rainAudio) {
          this.rainAudio.volume = targetVolume;
          if (targetVolume === 0 && !this.rainAudio.paused) {
            this.rainAudio.pause();
            this.isRainPlaying = false;
          }
        }
      }
    }, stepTime);
  }

  // === THUNDER AUDIO IMPLEMENTATION (REAL MP3 SOUNDS) ===
  public startThunderCycle() {
    if (this.isThunderCycleRunning) return;
    this.isThunderCycleRunning = true;

    // Ensimmäinen ukkonen kuuluu noin 8–15 sekunnin kuluttua siitä, kun pelaaja on aktivoinut äänet
    const initialDelay = 8000 + Math.random() * 7000;
    this.scheduleNextThunder(initialDelay);
  }

  private scheduleNextThunder(delayMs: number) {
    if (this.thunderTimeout) {
      clearTimeout(this.thunderTimeout);
    }

    this.thunderTimeout = setTimeout(() => {
      if (this.soundOn) {
        this.playRandomThunder();
      }

      // Seuraavat ukkoset kuuluvat satunnaisesti noin 25–60 sekunnin välein
      const nextInterval = 25000 + Math.random() * 35000;
      this.scheduleNextThunder(nextInterval);
    }, delayMs);
  }

  private playRandomThunder() {
    if (typeof window === 'undefined') return;

    const rand = Math.random();
    let chosenFile: string;
    let isClose = false;
    let flashIntensity = 0.22;
    let delayMs = 1500;
    let type: 'distant' | 'close' | 'strike' = 'distant';

    if (rand < 0.65) {
      // 65%: soundreality-thunder-sound-375727.mp3 (Kaukainen pitkä jyrinä - yleisin)
      chosenFile = this.thunderFiles.distant;
      isClose = false;
      flashIntensity = 0.22;
      delayMs = 1400 + Math.random() * 400; // 1.4 - 1.8 sekunnin viive (kaukainen)
      type = 'distant';
    } else if (rand < 0.80) {
      // 15%: freesound_community-thunder-big-crack-explosive-close-ms-77mel-190903-62202.mp3 (Voimakas läheinen - harvemmin)
      chosenFile = this.thunderFiles.close;
      isClose = true;
      flashIntensity = 0.65;
      delayMs = 700 + Math.random() * 300; // 0.7 - 1.0 sekunnin viive (läheinen)
      type = 'close';
    } else {
      // 20%: universfield-loud-thunder-192165.mp3 (Lyhyempi voimakas salamanisku - satunnaisesti)
      chosenFile = this.thunderFiles.strike;
      isClose = true;
      flashIntensity = 0.90;
      delayMs = 350 + Math.random() * 200; // 0.35 - 0.55 sekunnin viive (terävä salamanisku)
      type = 'strike';
    }

    // 1.⚡ Salaman välähdys tapahtuu välittömästi
    this.notifyThunder({ isClose, flashIntensity, type, delayMs });

    // 2. 🔊 Ukkosen jyrinä kuuluu 0,4–1,8 sekuntia myöhemmin etäisyydestä riippuen
    setTimeout(() => {
      if (!this.soundOn) return;
      try {
        const thunderAudio = new Audio(chosenFile);
        const baseVol = isClose ? (0.75 + Math.random() * 0.15) : (0.50 + Math.random() * 0.20);
        thunderAudio.volume = Math.min(1.0, baseVol);
        thunderAudio.play().catch(() => {
          // File may be missing or blocked before user interaction
        });
      } catch (e) {}
    }, delayMs);
  }

  public setVolume(musicOn: boolean, soundOn: boolean) {
    this.soundOn = soundOn;
    this.musicOn = musicOn;

    // Rain volume
    if (this.rainAudio) {
      if (soundOn) {
        if (this.rainAudio.paused) {
          this.startRainAudio();
        } else {
          this.fadeRainVolume(0.20, 1000);
        }
      } else {
        this.fadeRainVolume(0.0, 1000);
      }
    } else if (soundOn) {
      this.startRainAudio();
    }

    // Menu music volume
    if (this.ctx && this.menuMusicGain) {
      const t = this.ctx.currentTime;
      const targetMenuMusic = musicOn && this.isMenuMusicActive ? 0.25 : 0.0;
      this.menuMusicGain.gain.cancelScheduledValues(t);
      this.menuMusicGain.gain.linearRampToValueAtTime(targetMenuMusic, t + 0.5);
    }
  }

  // === MAIN MENU MUSIC ===
  public startMainMenuMusic() {
    this.initAndStart();
    if (!this.ctx || !this.menuMusicGain) return;

    if (this.isMenuMusicActive) return;
    this.isMenuMusicActive = true;

    const t = this.ctx.currentTime;

    if (this.musicOn) {
      this.menuMusicGain.gain.cancelScheduledValues(t);
      this.menuMusicGain.gain.setValueAtTime(0.0, t);
      this.menuMusicGain.gain.linearRampToValueAtTime(0.25, t + 2.0);
    }

    this.startDrone();
    this.schedulePianoNote();
  }

  private startDrone() {
    if (!this.ctx || !this.menuMusicGain) return;
    this.stopDrone();

    const t = this.ctx.currentTime;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.0, t);
    this.droneGain.gain.linearRampToValueAtTime(0.45, t + 4.0);

    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(110, t);
    this.droneFilter.Q.setValueAtTime(1.8, t);

    const freqs = [55.00, 82.41, 110.00];
    this.droneOscs = freqs.map((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      osc.type = idx === 1 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      const detuneCents = (idx - 1) * 4;
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

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, t);
    lfoGain.gain.setValueAtTime(35, t);

    lfo.connect(lfoGain);
    lfoGain.connect(this.droneFilter.frequency);
    lfo.start(t);
    this.droneOscs.push(lfo);
  }

  private stopDrone() {
    this.droneOscs.forEach((osc) => {
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

  private schedulePianoNote() {
    if (!this.isMenuMusicActive) return;

    const nextDelayMs = 4000 + Math.random() * 5000;
    this.pianoTimeout = setTimeout(() => {
      this.playPianoNote();
      this.schedulePianoNote();
    }, nextDelayMs);
  }

  private playPianoNote() {
    if (!this.ctx || !this.menuMusicGain || !this.isMenuMusicActive) return;

    const t = this.ctx.currentTime;
    const scale = [220.00, 261.63, 329.63, 440.00, 493.88, 523.25, 659.25];
    const freq = scale[Math.floor(Math.random() * scale.length)];

    const pianoOsc = this.ctx.createOscillator();
    const pianoGain = this.ctx.createGain();
    const hammerOsc = this.ctx.createOscillator();
    const hammerGain = this.ctx.createGain();

    pianoOsc.type = 'triangle';
    pianoOsc.frequency.setValueAtTime(freq, t);

    pianoGain.gain.setValueAtTime(0.0, t);
    pianoGain.gain.linearRampToValueAtTime(0.16, t + 0.02);
    pianoGain.gain.exponentialRampToValueAtTime(0.001, t + 4.5);

    hammerOsc.type = 'sine';
    hammerOsc.frequency.setValueAtTime(freq * 3, t);
    hammerGain.gain.setValueAtTime(0.05, t);
    hammerGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    pianoOsc.connect(pianoGain);
    hammerOsc.connect(hammerGain);

    pianoGain.connect(this.menuMusicGain);
    hammerGain.connect(this.menuMusicGain);

    pianoOsc.start(t);
    hammerOsc.start(t);

    pianoOsc.stop(t + 4.8);
    hammerOsc.stop(t + 0.1);
  }

  public fadeAndStopMainMenuMusic() {
    if (!this.ctx || !this.menuMusicGain || !this.isMenuMusicActive) return;

    this.isMenuMusicActive = false;
    clearTimeout(this.pianoTimeout);

    const t = this.ctx.currentTime;
    this.menuMusicGain.gain.cancelScheduledValues(t);
    this.menuMusicGain.gain.linearRampToValueAtTime(0.001, t + 1.0);

    setTimeout(() => {
      this.stopDrone();
    }, 1100);
  }

  public stopMainMenuMusic() {
    this.isMenuMusicActive = false;
    clearTimeout(this.pianoTimeout);
    this.stopDrone();
    if (this.menuMusicGain && this.ctx) {
      try {
        this.menuMusicGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      } catch (e) {}
    }
  }

  // === UI SOUND EFFECTS ===
  public playTransitionSound() {
    this.initWebAudio();
    if (!this.ctx || !this.masterGain || !this.soundOn) return;

    const t = this.ctx.currentTime;

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
  }

  public playPaperRustle() {
    this.initWebAudio();
    if (!this.ctx || !this.masterGain || !this.soundOn) return;
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

  public playWoodCreak() {
    this.initWebAudio();
    if (!this.ctx || !this.masterGain || !this.soundOn) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);

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

  public playMetalClink() {
    this.initWebAudio();
    if (!this.ctx || !this.masterGain || !this.soundOn) return;
    const t = this.ctx.currentTime;

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

  public playFabricRustle() {
    this.initWebAudio();
    if (!this.ctx || !this.masterGain || !this.soundOn) return;
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

  public playInvestigationStinger() {
    this.initWebAudio();
    if (!this.ctx || !this.masterGain || !this.soundOn) return;
    const t = this.ctx.currentTime;

    const freqs = [55.00, 82.41, 110.00, 164.81];
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

  public playClueDiscovered() {
    this.playInvestigationStinger();
  }

  public playContradictionFound() {
    this.initWebAudio();
    if (!this.ctx || !this.masterGain || !this.soundOn) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const t = this.ctx.currentTime;
    const freqs = [73.42, 77.78];
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

  public playClick() {
    this.initWebAudio();
    if (!this.ctx || !this.masterGain || !this.soundOn) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(85, this.ctx.currentTime + 0.04);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
}

export const audioSynth = new AmbientAudioEngine();

export function useAudio(settings: Settings) {
  useEffect(() => {
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
