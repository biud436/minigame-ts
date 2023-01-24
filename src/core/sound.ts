export class Sound {
    private static INSTANCE: Sound;

    private soundPool: Map<string, HTMLAudioElement> = new Map();

    private constructor() {}

    static getInstance(): Sound {
        if (!Sound.INSTANCE) {
            Sound.INSTANCE = new Sound();
        }

        return Sound.INSTANCE;
    }

    playOnce(filename: string): void {
        const audio = new Audio(filename);
        audio.loop = false;
        audio.volume = 0.2;
        audio.play();
    }

    playLoop(filename: string): void {
        const audio = new Audio(filename);
        audio.loop = true;
        audio.play();

        this.soundPool.set(filename, audio);
    }

    resume(filename: string): void {
        const audio = this.soundPool.get(filename);
        if (audio) {
            audio.play();
        }
    }

    stop(filename: string): void {
        const audio = this.soundPool.get(filename);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    clear(): void {
        this.soundPool.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.soundPool.clear();
    }
}
