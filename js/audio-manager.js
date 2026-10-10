/**
 * Manages background music and game sound effects.
 */
class AudioManager {

    /** @type {string} Directory containing all audio files. */
    audioPath = 'assets/8. Audio/';

    /** @type {Object<string, HTMLAudioElement>} Available audio tracks. */
    sounds = {};

    /** @type {HTMLAudioElement|null} Currently playing music. */
    currentMusic = null;

    /** @type {boolean} Whether audio is muted. */
    muted = false;

    /** @type {Set<HTMLAudioElement>} Active sound effects. */
    activeEffects = new Set();

    /**
     * Creates and prepares the game's audio tracks.
     */
    constructor() {
        this.loadSounds();
    }

    /**
     * Registers all background tracks and sound effects.
     *
     * @returns {void}
     */
    loadSounds() {
        const files = {
            menu: 'menu-music.mp3',
            game: 'game-music.mp3',
            idle: 'bubbles-loop2-amp.wav',
            bubble: 'bubbles-single2.wav',
            finSlap: 'swosh-01.wav',
            damage: 'damage_taken.mp3',
            electric: 'electric-hit.wav',
            bite: 'crunchybite.ogg',
            pop: 'pop1.wav',
            coin: 'coin.wav',
            potion: 'potion-pickup.wav',
            bossDeath: 'vgdeathsound.wav',
            victory: 'Clear Skies.mp3',
            gameOver: 'game_over_bad_chest.wav'
        };

        Object.entries(files).forEach(([name, file]) => {
            this.sounds[name] = new Audio(this.audioPath + file);
            this.sounds[name].preload = 'auto';
        });
    }

    /**
     * Starts a background music track.
     *
     * @param {string} name - Name of the music track.
     * @returns {void}
     */
    playMusic(name) {
        const music = this.sounds[name];
        if (!music || this.currentMusic === music) return;

        this.stopMusic();
        this.currentMusic = music;
        music.loop = true;
        music.volume = 0.25;
        music.muted = this.muted;
        music.currentTime = 0;
        music.play().catch(() => {});
    }

    /**
     * Stops the currently playing music.
     *
     * @returns {void}
     */
    stopMusic() {
        if (!this.currentMusic) return;

        this.currentMusic.pause();
        this.currentMusic.currentTime = 0;
        this.currentMusic = null;
    }

    /**
     * Plays a sound effect.
     *
     * @param {string} name - Name of the sound effect.
     * @param {number} volume - Playback volume.
     * @param {number} speed - Playback speed.
     * @returns {void}
     */
    playSound(name, volume = 0.5, speed = 1) {
        if (!this.sounds[name] || this.muted) return;

        const sound = this.sounds[name].cloneNode();
        sound.volume = volume;
        sound.playbackRate = speed;
        this.activeEffects.add(sound);
        sound.addEventListener('ended', () => this.activeEffects.delete(sound));
        sound.play().catch(() => this.activeEffects.delete(sound));
    }

    /**
     * Pauses all active audio.
     *
     * @returns {void}
     */
    pauseAll() {
        this.currentMusic?.pause();
        this.activeEffects.forEach(sound => sound.pause());
    }

    /**
     * Resumes all paused audio.
     *
     * @returns {void}
     */
    resumeAll() {
        this.currentMusic?.play().catch(() => {});
        this.activeEffects.forEach(sound => {
            if (!sound.ended) sound.play().catch(() => {});
        });
    }

    /**
     * Stops all active sound effects.
     *
     * @returns {void}
     */
    stopEffects() {
        this.activeEffects.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        this.activeEffects.clear();
    }

    /**
     * Enables or disables all audio.
     *
     * @returns {void}
     */
    toggleMute() {
        this.muted = !this.muted;
        if (this.currentMusic) this.currentMusic.muted = this.muted;
        this.activeEffects.forEach(sound => sound.muted = this.muted);
    }
}