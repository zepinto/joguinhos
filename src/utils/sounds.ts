// Web Audio API sound generation utilities

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function playStartSound(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Three ascending beeps
  const frequencies = [440, 554, 659]; // A4, C#5, E5
  
  frequencies.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = freq;
    
    gainNode.gain.setValueAtTime(0.3, now + i * 0.15);
    gainNode.gain.exponentialDecayToValueAtTime?.(0.01, now + i * 0.15 + 0.12) ||
      gainNode.gain.setValueAtTime(0.01, now + i * 0.15 + 0.12);
    
    oscillator.start(now + i * 0.15);
    oscillator.stop(now + i * 0.15 + 0.15);
  });

  // Final longer tone
  const finalOsc = ctx.createOscillator();
  const finalGain = ctx.createGain();
  
  finalOsc.connect(finalGain);
  finalGain.connect(ctx.destination);
  
  finalOsc.type = 'sine';
  finalOsc.frequency.value = 880; // A5
  
  finalGain.gain.setValueAtTime(0.4, now + 0.5);
  finalGain.gain.linearRampToValueAtTime(0.01, now + 0.9);
  
  finalOsc.start(now + 0.5);
  finalOsc.stop(now + 1);
}

export function playTimeUpSound(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Buzzer-like descending tone
  for (let i = 0; i < 3; i++) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(400, now + i * 0.25);
    oscillator.frequency.linearRampToValueAtTime(200, now + i * 0.25 + 0.2);
    
    gainNode.gain.setValueAtTime(0.2, now + i * 0.25);
    gainNode.gain.linearRampToValueAtTime(0.01, now + i * 0.25 + 0.2);
    
    oscillator.start(now + i * 0.25);
    oscillator.stop(now + i * 0.25 + 0.25);
  }
}

export function playTickSound(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.value = 1000;
  
  gainNode.gain.setValueAtTime(0.1, now);
  gainNode.gain.linearRampToValueAtTime(0.01, now + 0.05);
  
  oscillator.start(now);
  oscillator.stop(now + 0.05);
}
