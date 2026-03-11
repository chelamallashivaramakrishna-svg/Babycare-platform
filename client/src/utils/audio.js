class SoundSynthesizer {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    playTone(freq, type = 'sine', duration = 0.1, vol = 0.1) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playPop() {
        this.playTone(800, 'sine', 0.1, 0.2);
    }

    playWin() {
        // C major chord arpeggio
        this.playTone(523.25, 'triangle', 0.2); // C5
        setTimeout(() => this.playTone(659.25, 'triangle', 0.2), 100); // E5
        setTimeout(() => this.playTone(783.99, 'triangle', 0.4), 200); // G5
        setTimeout(() => this.playTone(1046.50, 'triangle', 0.6), 300); // C6
    }

    playLose() {
        this.playTone(300, 'sawtooth', 0.3);
        setTimeout(() => this.playTone(250, 'sawtooth', 0.4), 200);
    }

    playDraw() {
        this.playTone(400 + Math.random() * 200, 'sine', 0.05, 0.05);
    }

    // Attempting a noise/pulse simulation for animals, or fallback to TTS
    playAnimal(animalName) {
        try {
            // Using SpeechSynthesis as a fun, guaranteed way to make animal sounds
            // "Moo", "Baa", "Woof", "Meow"
            const utterance = new SpeechSynthesisUtterance();
            utterance.rate = 1.2;
            utterance.pitch = 1.5;

            const sounds = {
                'dog': 'Woof! Woof!',
                'cat': 'Meow!',
                'cow': 'Mooo!',
                'pig': 'Oink oink!',
                'lion': 'Roar!',
                'duck': 'Quack quack!',
                'sheep': 'Baaa!',
                'horse': 'Neigh!'
            };

            const name = animalName.toLowerCase();
            let text = sounds[name] || `I am a ${animalName}!`;

            utterance.text = text;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            this.playPop(); // fallback
        }
    }
}

export const soundManager = new SoundSynthesizer();
