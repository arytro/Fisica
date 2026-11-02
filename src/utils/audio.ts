/**
 * Lightweight Web Audio API Synthesizer for Friction Lab
 * Zero external audio assets, extremely fast, works offline.
 */
class SoundEffects {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private slidingOsc: OscillatorNode | null = null;
  private slidingGain: GainNode | null = null;

  constructor() {
    // Initialized on first user interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.slidingGain) {
      this.slidingGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio context may be restricted
    }
  }

  public playBreakStatic() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Audio fallback
    }
  }

  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [440, 554.37, 659.25].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.2);
      });
    } catch {
      // Audio fallback
    }
  }

  public playIncorrect() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.25);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio fallback
    }
  }

  public updateSlidingHum(velocity: number) {
    if (this.isMuted || velocity <= 0.05) {
      if (this.slidingGain && this.ctx) {
        this.slidingGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      return;
    }
    try {
      this.initContext();
      if (!this.ctx) return;

      if (!this.slidingOsc || !this.slidingGain) {
        this.slidingOsc = this.ctx.createOscillator();
        this.slidingGain = this.ctx.createGain();
        this.slidingOsc.type = 'triangle';
        this.slidingOsc.frequency.setValueAtTime(80, this.ctx.currentTime);
        this.slidingGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.slidingOsc.connect(this.slidingGain);
        this.slidingGain.connect(this.ctx.destination);
        this.slidingOsc.start();
      }

      const clampedV = Math.min(velocity, 25);
      const targetFreq = 70 + clampedV * 12;
      const targetGain = Math.min(0.05, clampedV * 0.003);

      this.slidingOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.05);
      this.slidingGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    } catch {
      // Audio fallback
    }
  }
}

export const sound = new SoundEffects();
