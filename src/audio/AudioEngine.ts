// src/audio/AudioEngine.ts

class AudioEngine {
  private audioContext: AudioContext
  private gainNode: GainNode
  private activeSources: Map<string, AudioBufferSourceNode>
  private hudAudioContext: AudioContext
  private hudGainNode: GainNode
  private backgroundSource: AudioBufferSourceNode | null = null
  private backgroundStartTime: number = 0
  private backgroundPausedAt: number = 0
  private backgroundBuffer: AudioBuffer | null = null

  constructor() {
    // Main game audio context
    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)()
    this.gainNode = this.audioContext.createGain()
    this.gainNode.gain.value = 0.5 // Default volume to 0.5
    this.gainNode.connect(this.audioContext.destination)
    this.activeSources = new Map()

    // HUD audio context
    this.hudAudioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)()
    this.hudGainNode = this.hudAudioContext.createGain()
    this.hudGainNode.gain.value = 0.5 // Default volume to 0.5
    this.hudGainNode.connect(this.hudAudioContext.destination)
  }

  async loadAudioBuffer(
    audioContext: AudioContext,
    audioSrc: string
  ): Promise<AudioBuffer> {
    const response = await fetch(audioSrc)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    return audioBuffer
  }

  async playSound(audioSrc: string, loop: boolean = false): Promise<string> {
    const buffer = await this.loadAudioBuffer(this.audioContext, audioSrc)
    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    source.loop = loop
    source.connect(this.gainNode)
    source.start(0)

    const id = Math.random().toString(36).substr(2, 9) // Generate a unique ID
    this.activeSources.set(id, source)

    source.onended = () => {
      this.activeSources.delete(id)
    }

    return id
  }

  async playHUDSound(audioSrc: string): Promise<void> {
    const buffer = await this.loadAudioBuffer(this.hudAudioContext, audioSrc)
    const source = this.hudAudioContext.createBufferSource()
    source.buffer = buffer
    source.connect(this.hudGainNode)
    source.start(0)
  }

  async playPowerUpSound(): Promise<void> {
    const powerUpSound = await this.loadAudioBuffer(
      this.hudAudioContext,
      "/src/assets/audio/powerup.mp3"
    )
    const source = this.hudAudioContext.createBufferSource()
    source.buffer = powerUpSound
    source.connect(this.hudGainNode)
    source.start(0)
  }

  stopSound(id: string) {
    const source = this.activeSources.get(id)
    if (source) {
      source.stop()
      this.activeSources.delete(id)
    }
  }

  async playBackgroundMusic(audioSrc: string) {
    if (!this.backgroundBuffer) {
      this.backgroundBuffer = await this.loadAudioBuffer(
        this.audioContext,
        audioSrc
      )
    }
    if (this.backgroundSource) {
      this.backgroundSource.stop()
    }
    this.backgroundSource = this.audioContext.createBufferSource()
    this.backgroundSource.buffer = this.backgroundBuffer
    this.backgroundSource.loop = true
    this.backgroundSource.connect(this.gainNode)
    this.backgroundStartTime =
      this.audioContext.currentTime - this.backgroundPausedAt
    this.backgroundSource.start(0, this.backgroundPausedAt)
  }

  pauseBackgroundMusic() {
    if (this.backgroundSource) {
      this.backgroundPausedAt =
        this.audioContext.currentTime - this.backgroundStartTime
      this.backgroundSource.stop()
      this.backgroundSource = null
    }
  }

  resumeBackgroundMusic() {
    if (this.backgroundBuffer) {
      this.playBackgroundMusic("") // Passing an empty string since the buffer is already loaded
    }
  }

  async stopAllSounds() {
    this.activeSources.forEach((source) => source.stop())
    this.activeSources.clear()
  }

  setVolume(volume: number) {
    this.gainNode.gain.value = volume
    this.hudGainNode.gain.value = volume
  }

  suspend() {
    this.audioContext.suspend()
  }

  resume() {
    this.audioContext.resume()
  }
}

export default new AudioEngine()
